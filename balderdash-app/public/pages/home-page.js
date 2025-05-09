import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { router } from '../router/index.js'; // Import your router


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

    if (startGameButton) {
      startGameButton.addEventListener('click', () => {
        this.handleStartGameClick();
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

        .home-page {
          width: 100%;
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          box-sizing: border-box;
        }
      </style>
      <section class="home-page">
        <vertical-container-h>
          <primary-button id="start-game-button">Start Game</primary-button>
          <primary-button>Join Game</primary-button>
          <primary-button>Score History</primary-button>
          <secondary-button>Logout</secondary-button>
          <div class="data-display"></div>
        </vertical-container-h>

      </section>
    `;
  }

  async handleStartGameClick() {
    const spinner = document.getElementById('loading-spinner');
    spinner.show(); // Show the spinner

    try {
      //TODO: replace with actual fetch and navigations
      const data = await this.fetchGameData();
      console.log('Data fetched:', data);

      router.navigate('/home', data);
    } catch (error) {
      console.error('Error fetching data:', error);

    } finally {
      setTimeout(() => spinner.hide(), 5000)
    }
  }

  async fetchGameData() {

    const response = await fetch('http://localhost:8080/api/rounds/games/1/current-round', {
      method: "GET",
    })

    if (!response) {
      return {}
    }

    const data = await response.json();

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