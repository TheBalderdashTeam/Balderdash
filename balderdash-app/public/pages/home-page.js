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

        header section {
  text-align: center;
  margin-top: 3rem;
}

header p {
  margin: 0.5rem 0;
  font-size: clamp(2rem, 8vw, 1.5rem);
}

header .sub-heading {
  margin: 0.5rem 0.5rem;
  font-size: 0.8rem;
  font-family: sans-serif;
  font-style: italic;
}

header .animated-text {
  display: inline-block;
}

.animated-text {
  border-right: solid 3px rgba(240, 46, 170, 0.8);
  white-space: nowrap;
  overflow: hidden;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(2rem, 8vw, 4rem);
  color: rgba(255, 255, 255, .70);
  margin: 0 auto;
}

/* Animation */
.animated-text {
  animation: animated-text 2s steps(10, end) 1s 1 normal both,
    animated-cursor 600ms steps(10, end) infinite;
}

/* text animation */

@keyframes animated-text {
  from {
    width: 0;
  }

  to {
    width: 10ch;
  }
}

/* cursor animations */

@keyframes animated-cursor {
  from {
    border-right-color: rgba(0, 102, 204, 0.8);
  }

  to {
    border-right-color: transparent;
  }
}
      </style>

      <section class="home-page">
        <header>
          <section>
            <p class = "animated-text">Dalderbash</p>
            <p class ="sub-heading">Committing an act that is adjacent to, but not quite, copyright infringement</p>
          </section>
        </header>
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