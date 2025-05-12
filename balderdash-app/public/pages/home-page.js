import { router } from '../router/index.js';
import { apiFetch, logoutUser } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';
import { 
  PrimaryButton,
  SecondaryButton,
  VerticalContainerH,
} from '../components/index.js';

export class HomePage extends HTMLElement {

  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.routeData = null;
  }

  connectedCallback() {
    this.render();
    this.updateContent();

    const startGameButton = this.shadowRoot.querySelector('#start-game-button');
    const joinGameButton = this.shadowRoot.querySelector('#join-game-button');
    const leaderboardButton = this.shadowRoot.querySelector('#leaderboard-button');
    const logoutButton = this.shadowRoot.querySelector('#logout-button');

    startGameButton.addEventListener('click', () => {
      this.onStartGameClick();
    });

    joinGameButton.addEventListener('click', () => {
      this.onJoinGameClick();
    });

    leaderboardButton.addEventListener('click', () => {
      this.onLeaderboardClick();
    });

    logoutButton.addEventListener('click', () => {
      this.onLogoutClick();
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

        .home-page ${pageStyles}
      </style>

      <section class="home-page">

        <vertical-container-h 
          backgroundColour="rgba(255, 255, 255, 0.8)"
          padding="16px"
          borderRadius="10px"
          maxWidth="482px">
          
          <primary-button id="start-game-button">Start Game</primary-button>
          <primary-button id="join-game-button">Join Game</primary-button>
          <primary-button id="leaderboard-button">Leaderboard</primary-button>
          <secondary-button id="logout-button">Logout</secondary-button>

        </vertical-container-h>
      </section>
    `;
  }

  async onJoinGameClick() {
    router.navigate('/join-game');
  }

  async onLogoutClick() {
    await logoutUser();
  }

  async onLeaderboardClick() {
    router.navigate('/leaderboard');
  }

  async onStartGameClick() {
    router.navigate('/game-settings');
    // router.navigate('/lobby');
  }

  async fetchGameData() {

    const data = await apiFetch('games/1', {
      method: "GET",
    });

    if (!data) {
      return {};
    }

    console.log({data});
    return data;
  }

  updateContent() {
    // Select the data display area
    const dataDisplay = this.shadowRoot.querySelector('.data-display');
     if (dataDisplay) {
        // Display data if available
        if (this.routeData) {
          dataDisplay.textContent = `Received Data: ${JSON.stringify(this.routeData)}`;
        } else {
          dataDisplay.textContent = 'No data received yet.';
        }
    }
  }
}