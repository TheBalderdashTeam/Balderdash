import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';


export class LobbyPage extends HTMLElement {
  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.pollingInterval = null;     
  }

  connectedCallback() {
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

  startPollingForPlayers() {
    this.pollingInterval = setInterval(async () => {
     
      const gameData = await apiFetch('games', {
        method: 'GET',
      });

      if (gameData) {
        const data = await response.json();
        console.log('Players:', data.players); // Update UI or store the data
        
        if (gameData.status === 'Active') {
          this.stopPollingForPlayers();
          router.navigate('/game', data);
        }
      }      
    }, 3000);
  }

  stopPollingForPlayers() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}