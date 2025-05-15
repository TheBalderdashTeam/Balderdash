import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';

export class LobbyPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.pollingInterval = null;
    }

    async connectedCallback() {
        this.render();
        this.init();
    }

    async init() {
      await this.getGameInfo();
      this.startPollingForGameStart();
    }

    disconnectedCallback() {
        this.stopPollingForGameStart();
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
      </style>

      <section class="lobby-page">

        <section>
          <img src=" /images/loading.gif" alt="Loading..." class="loading-spinner">
        </section>

        <section>
          <p id="hangtight">Hang tight</p>
        </section>

        <section>
          <p>The game will start soon!</p>
        </section>
      </section>
    `;
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
        if (gameData.game.hostUserId === userData.id) {
            router.navigate('/host-lobby');
        }
    }

    startPollingForGameStart() {
        this.pollingInterval = setInterval(async () => {
            const gameData = await apiFetch(
                'games',
                {
                    method: 'GET',
                },
                null,
                false
            );

            if (gameData) {
                if (gameData.status === 'Active') {
                    this.stopPollingForGameStart();
                    router.navigate('/submit-definition', { game: gameData });
                }
            }
        }, 3000);
    }

    stopPollingForGameStart() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}
