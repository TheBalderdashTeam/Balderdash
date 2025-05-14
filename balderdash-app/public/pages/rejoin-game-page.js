import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { getItem } from '../js/storage.js';

export class ReJoinGamePage extends HTMLElement {
    constructor(sourceUrl) {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.sourceUrl = sourceUrl;
    }

    connectedCallback() {
        this.render();

        const joinGameButton =
            this.shadowRoot.querySelector('#join-game-button');

        joinGameButton.addEventListener('click', () => {
            this.onJoinGameClick();
        });

        const leaveGameButton =
            this.shadowRoot.querySelector('#leave-game-button');

        leaveGameButton.addEventListener('click', () => {
            this.onLeaveGameClick();
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

        <section>
          <p>You have an active game, rejoin or leave the previous</p>
        </section>

        <primary-button id="join-game-button">Re-join Game</primary-button>
        <primary-button id="leave-game-button">Leave Game</primary-button>
      </section>
    `;
    }

    async onJoinGameClick() {
        const gameData = await apiFetch('games', {
            method: 'GET',
        });

        if (gameData) {
            router.navigate('/lobby');
        }
    }

    async onLeaveGameClick() {
        const gameData = await apiFetch('games/leave', {
            method: 'POST',
        });

        console.log(this.sourceUrl);

        router.navigate(this.sourceUrl || '/home');
    }
}
