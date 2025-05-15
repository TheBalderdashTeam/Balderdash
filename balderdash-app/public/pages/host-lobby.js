import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';

export class HostLobbyPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.pollingInterval = null;
        this.waitingPlayers = 0;
        this.lobbyCode = '';
    }

    connectedCallback() {
      this.init();
    }

    async init() {
      await this.getGameInfo();
      this.render();
      this.startPollingForPlayers();
    }

    disconnectedCallback() {
        this.stopPollingForPlayers();
    }

    render() {
        this.shadow.innerHTML = `
      <style>
        :host {
          display: flex;
          box-sizing: border-box;
          flex: 1;
          position: relative;  
        }
        
        .lobby-page ${pageStyles}

        .loading-spinner {
          width: 120px;
          height: auto;
          margin: 2rem auto;
        }

        #hangtight {
          font-size: var(--font-large);
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .game-start-message {
          font-size: 1.25rem;
          margin-top: 1rem;
          color: var(--text-rgb-29-27-32);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            padding: 2rem 1rem;
            background-color: white;
        }

        .logo {
            display: block;
            width: 80%;
            max-width: 350px;
            height: auto;
            margin-bottom: 1.5rem;
        }

        .lobby-container {
            width: 100%;
            max-width: 500px;
            text-align: center;
        }

        .lobby-title {
            font-size: 2.5vw;  /* scales with screen width */
            max-font-size: 1.5rem;  /* use clamp() for even better control in modern CSS */
            margin-bottom: 1.5rem;
        }

        .code-display {
        box-shadow: rgba(255, 255, 255, 0.4) 5px 5px,
            rgba(255, 255, 255, 0.3) 10px 10px,
            rgba(255, 255, 255, 0.2) 15px 15px,
            rgba(255, 255, 255, 0.1) 20px 20px,
            rgba(255, 255, 255, 0.05) 25px 25px;
            background-color: white;
            border: none;
            color: #1f1f1f;
            padding: 1.5rem;
            border-radius: 8px;
            font-size: 2rem;
            margin-bottom: 2rem;
            letter-spacing: 0.25em;
        }

        .code-info {
            color: white;
            margin-bottom: 2rem;
            font-size: 1rem;
        }

        .waiting-status {
            border: 1px solid #ddd;
            border-radius: 25px;
            padding: 0.8rem 1.5rem;
            display: inline-block;
            margin-bottom: 2rem;
            font-size: 1rem;
        }

        .waiting-status .count {
            font-weight: bold;
            font-size: 1.2rem;
            margin-right: 0.5rem;
        }

        .footer {
            width: 100%;
            padding: 1.5rem;
            text-align: center;
            margin-top: auto;
        }

      </style>

      <section class="lobby-page">
        <section class="lobby-container">
            <h2 class="lobby-title">Here is your lobby code!</h2>
            
            <section class="code-display">${this.lobbyCode}</section>
            
            <p class="code-info">Your friends can play the game using this code</p>
            
            <section class="waiting-status">
                <span class="count">${this.waitingPlayers}</span> players are waiting in the lobby
            </section>
        </section>

        <section class="footer">
          <primary-button id="start-game-button">
            Start game
          </primary-button>
        </section>
      </section>
</body>
</html>
    `;

        const startGameButton =
            this.shadowRoot.querySelector('#start-game-button');

        startGameButton.addEventListener('click', () => {
            this.startGame();
        });
    }

    async getGameInfo() {
        const gameData = await apiFetch('games', {
            method: 'GET',
        });

        const userData = await apiFetch('user', {
            method: 'GET',
        });

        if (gameData) {
            this.lobbyCode = gameData.game.lobbyCode;
        }

        //Check game state to see if the player is on the correct page
        if (gameData.game.hostUserId !== userData.id) {
            this.stopPollingForPlayers();
            router.navigate('/lobby');
        }
    }

    async startGame() {
        try {
            const response = await apiFetch('games/start', {
                method: 'POST',
            });

            if (response || response.game) {
                const data = await response.game;

                this.stopPollingForPlayers();
                router.navigate('/submit-definition', { game: data });
            } else {
                this.stopPollingForPlayers();
                console.warn('Failed to create game');
            }
        } catch (error) {
            this.stopPollingForPlayers();
            console.error('Error creating game:', error);
        }
    }

    startPollingForPlayers() {
        this.pollingInterval = setInterval(async () => {
            this.updatePlayerCount();
        }, 3000);
    }

    async updatePlayerCount() {
        const response = await apiFetch(
            'user/all-players',
            {
                method: 'GET',
            },
            null,
            false
        );

        if (response) {
            console.log(response.length);

            if (this.waitingPlayers !== response.length) {
                this.waitingPlayers = response.length;
                this.render();
            }
        }
    }

    stopPollingForPlayers() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}
