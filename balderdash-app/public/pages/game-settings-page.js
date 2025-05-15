import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton, BaseInput } from '../components/index.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';

export class GameSettingsPage extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.getGameInfo();

    const createGameButton = this.shadowRoot.querySelector('#create-game-button');

    if (createGameButton) {
      createGameButton.addEventListener('click', () => {
        const roundsInput = this.shadowRoot.querySelector('#rounds');
        const secondsInput = this.shadowRoot.querySelector('#seconds');

        if (roundsInput && secondsInput) {
          const rounds = roundsInput.value;
          const seconds = secondsInput.value;

          this.createGame(rounds, seconds);
        }
      });
    }

    const loginButton = this.shadowRoot.querySelector(
      '#google-login-button'
    );

    if (loginButton) {
      loginButton.addEventListener('click', () => {
        this.handleGoogleLogin();
      });
    }
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

        .game-settings-page ${pageStyles}

         .word-image {
          display: block;
          margin: 0 auto 5rem auto;
          max-width: 15rem;
          height: 10rem;
        }

      </style>

      <section class="game-settings-page">
      <img 
          src="../images/word.png" 
          alt="Word Card" 
          class="word-image"
        />

        <base-input 
          id="rounds" 
          type="number" 
          label="How many rounds do you want to play?"></base-input>
        <base-input 
          id="seconds" 
          type="number" 
          label="How many seconds per round?"></base-input>
  
        <primary-button id="create-game-button">
          Create game
        </primary-button>
    </section>
    `;
  }

  async getGameInfo() {
    const gameData = await apiFetch(
      'games',
      {
        method: 'GET',
        showSpinner: true,
        errorOnFail: false,
      }
    );

    if (gameData) {
      router.navigate('/rejoin-game', {
        sourceUrl: '/game-settings',
      });
    }
  }

  async createGame(round, seconds) {
    try {
      const response = await apiFetch(
        'games',
        {
          method: 'POST',
          body: { numberRounds: round, timeLimitSeconds: seconds },
        },
        
      );

      if (response || response.game) {
        const data = response.game;

        router.navigate('/lobby', { game: data });
      } else {
        console.warn('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }

  async handleGoogleLogin() {
    window.location.href = '/auth/google';
  }
}
