import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { getItem } from '../js/storage.js';
import { showErrorScreen } from '../js/helpers.js';


export class JoinGamePage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.isValidInput = false;
        this.lobbyCodeInput = null;
    }

    connectedCallback() {
        this.render();
        this.getGameInfo();

        const joinGameButton =
            this.shadowRoot.querySelector('#join-game-button');
        this.lobbyCodeInput = this.shadowRoot.querySelector('#lobby-code');

        this.lobbyCodeInput.validator = this.validateLobbyCode;

        this.lobbyCodeInput.addEventListener('input-validation', (event) => {
            this.isValidInput = event.detail.valid;
            if (this.isValidInput) {
                joinGameButton.removeAttribute('disabled');
            } else {
                joinGameButton.setAttribute('disabled', true);
            }
        });

        joinGameButton.addEventListener('click', () => {
            this.onJoinGameClick();
        });
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

        .input-container {
          height: 100%;
          width: 100%;
        }
        
        .join-game-page ${pageStyles}

        .join-image {
          display: block;
          margin: 0 auto 5rem auto;
          max-width: 10rem;
        }

      </style>

      <section class="join-game-page">
        <img 
          src="../images/join-game.png" 
          alt="Join" 
          class="join-image"
        />

        <section class="input-container">
          <base-input id="lobby-code"
            label="Enter lobby code"
            minLength="8"
            maxLength="8"></base-input>
        </section>

        <primary-button id="join-game-button" disabled>Join Game</primary-button>
      </section>
    `;
    }

    async getGameInfo() {
        const gameData = await apiFetch(
            'games',
            {
                method: 'GET',
            },
            null,
            true,
            false
        );

        console.log({ gameData });
        if (gameData) {
            router.navigate('/rejoin-game', {
                sourceUrl: '/join-game',
            });
        }
    }

    validateLobbyCode(lobbyCode) {
        if (!lobbyCode) {
            return 'Please enter a lobby code to continue.';
        }

        if (lobbyCode.length < 8) {
            return 'Lobby code must be 8 characters.';
        }
        return '';
    }

    async onJoinGameClick() {
        if (this.isValidInput) {
            const lobbyCode = this.lobbyCodeInput?.value;
            const success = await apiFetch(`games/${lobbyCode}`, {
                method: 'POST',
            });

      if (success) {
        router.navigate('/lobby');
      }
      else {
        showErrorScreen({
          message: 'Invalid Lobby Code',
        });
      }
    }
  }
}
