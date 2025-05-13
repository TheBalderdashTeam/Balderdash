import { router } from '../router/index.js';
import { apiFetch, logoutUser } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';
import { 
  PrimaryButton,
  SecondaryButton,
  VerticalContainerH,
  HorizontalContainerV,
  BaseInput,
} from '../components/index.js';

export class SubmitDefinitionPage extends HTMLElement {

  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.routeData = null;
  }

  connectedCallback() {
    this.render();
    this.updateContent();

    const startGameButton = this.shadowRoot.querySelector('#start-game-button');

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

        .progress-bar {
          width: 100%;
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
        }

        .progress {
          height: 10px;
          width: 40%; /* Simulate progress */
          background-color: black;
        }

        .time {
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          font-weight: bold;
          margin-top: 0.5rem;
        }

        .word {
          font-size: 25px;
          font-weight: bold;
          word-wrap: break-word;
        }

        p {
          white-space: pre-wrap; 
          text-align: center;
          overflow: hidden;
        }

        .submit-definition-page ${pageStyles}
        
      </style>

      <section class="submit-definition-page">
        <vertical-container-h
          hostHeight="auto"
          justifyContent="flex-start">

          <p>Time left to submit a definition</p>

          <horizontal-container-v
            minHeight="10px"
            backgroundColour="white"
            justifyContent="flex-start">

            <section class="progress"></section>

          </horizontal-container-v>

          <section class="time">02:00</section>
        </vertical-container-h>

        <vertical-container-h
          hostHeight="100%">

          <p class="word">Supercalifragilisticexpialidocious</p>
      
          <base-input id="definition" label="Type out a fake definition"></base-input>
        </vertical-container-h>

        <vertical-container-h
          hostHeight="auto"
          justifyContent= "flex-end">
          
          <primary-button>Submit</primary-button>
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