import { router } from '../router/index.js';
import { apiFetch, logoutUser } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';
import { setItem } from '../js/storage.js';
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
    this.username= null;
  }

  connectedCallback() {
    this.render();
    this.fetchUserInfo();

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

        #greeting {
          font-size: 25px;
          font-weight: 600;
          text-align: center;
        }

        .home-page ${pageStyles}
      </style>

      <section class="home-page">
        <p id="greeting"></p>
        <vertical-container-h 
          backgroundColour="rgb(114, 118, 212);"
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
  }

  async fetchUserInfo() {

    const userData = await apiFetch('user', {
      method: "GET",
    });

    if (userData) {
      this.username = userData.username;
      setItem('user-data', userData);
      this.updateContent();
    }
  }

  updateContent() {
    
    const greeting = this.shadowRoot.querySelector('#greeting');

    greeting.innerHTML = '';

    greeting.innerHTML = `Welcome, ${this.username}`;
  }
}