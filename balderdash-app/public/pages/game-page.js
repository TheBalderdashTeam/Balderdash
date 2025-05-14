import { 
  PrimaryButton,
  SecondaryButton,
  VerticalContainerH,
  HorizontalContainerV,
  BaseInput,
  Timer,
} from '../components/index.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';

export class GamePage extends HTMLElement {

  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.roundData = null;
    this.roundWord = '';
  }

  connectedCallback() {
    this.render();

    this.init();

    const startGameButton = this.shadow.querySelector('#start-game-button');

    if (startGameButton) {
      startGameButton.addEventListener('click', () => {
        this.handleNextRoundClick();
      });
    }
  }

  async init() {
    await this.fetchRoundData();
    this.updateContent();
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

        p {
          margin: 0;
          text-align: center;
          word-wrap: break-word;
        }
          
        .word {
          font-size: clamp(1.5rem, 5vw, 2rem);
          font-weight: bold;
          width: 100%;
          text-align: center;
          margin: 0 0 16px;
        }

        .options-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            padding: 0px;
            justify-content: space-evenly;
            flex-direction: row;
        }

        .option {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 1rem;
            text-align: center;
            font-size: 12px;
            color: black;
            background-color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            transition: background-color 0.2s;
            min-height: 80px; 
            min-width: 180px;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            word-wrap: break-word;
        }

        .word-time {
          position: sticky;
          top: 0;
        }

        .option:hover {
            background-color: #f5f5f5;
        }

        .game-page ${pageStyles}

      </style>

      <section class="game-page">
        <vertical-container-h class="word-time"
          backgroundColour="rgb(114, 118, 212);"
          borderRadius="10px"
          maxWidth="100%"
          padding="16px">
            <p>Time left to choose a definition</p>
            <progress-timer duration="30" running></progress-timer>
            
            <p class="word"></p>
            <p>Select the correct definition below</p>

          
        </vertical-container-h>

        <ul class="options-container"></ul>

      </section>
    `;
  }

  async handleNextRoundClick() {
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

  async fetchRoundData() {

    if (!this.roundData) {

      const roundData = await apiFetch('games/current-round', {
        method: "GET",
      });
      
      if (!roundData) {
        return
      }
      
      this.roundData = roundData;
    }

    this.roundWord = this.roundData.word.word;
  }

  updateContent() {
    // Select the data display area
    this.shadow.querySelector('.word').textContent = this.roundData.word.word;
    if (Array.isArray(this.roundData?.definitions)) {
      const optionsContainer = this.shadow.querySelector('.options-container');
      this.roundData.definitions.forEach((def, _) => {

        const definition = document.createElement('li');
        definition.className = 'option';
        definition.id = def.id;
        definition.className = 'option';
        definition.innerHTML = `<p>A fictional or humorous term describing the peculiar state of being simultaneously confused, mildly annoyed, and oddly amused by an overly complicated situation involving unnecessary details or baffling instructions. Often used when encountering bureaucracy, unclear user manuals, or a sudden shift in social expectations. Not a clinical term, but commonly felt during tech support calls, assembling IKEA furniture, or navigating complex return policies after midnight.</p>`;
        
        optionsContainer.appendChild(definition);
        });
    }
  }
}