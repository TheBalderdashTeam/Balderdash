import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';
import { 
  PrimaryButton,
  SecondaryButton,
  VerticalContainerH,
  HorizontalContainerV,
  BaseInput,
  Timer,
} from '../components/index.js';
import { showErrorScreen } from '../js/helpers.js';

export class SubmitDefinitionPage extends HTMLElement {

  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.roundData = null;
    this.submitDefinitionButton = null;
  }

  connectedCallback() {
    this.render();

    this.submitDefinitionButton = this.shadow.querySelector('#submit-definition');
    const timer = this.shadow.querySelector('#progress-timer');

    timer.addEventListener('timer-end', (event) => {
      this.submitDefinition();
    });

    this.submitDefinitionButton.addEventListener('click', (_) => {
      timer.removeAttribute('running');
      this.submitDefinition();
    });

    if (!this.roundData) {
      this.fetchRoundData();
    }

  }

  disconnectedCallback() {
    this.stopPollingForRoundStart();
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

        .word-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%
        }

        .word {
          display: inline-block;
          border-right: solid 3px rgba(240, 46, 170, 0.8);
          white-space: nowrap;
          overflow: hidden;
          font-family: 'Source Code Pro', monospace;
          font-size: clamp(1rem, 8vw, 2rem);
          color: rgba(255, 255, 255, .70);
          animation: animated-text 1s steps(var(--word-length), end) 1s 1 normal both,
          animated-cursor 600ms steps(var(--word-length), end) infinite;
}   

        p {
          text-align: center;
        }

        .def-instruction{
          margin-bottom: 1rem;
        }

        .submit-definition-page ${pageStyles}

        .definition {
          box-shadow: rgba(255, 255, 255, 0.4) 5px 5px;
          background-color: white;
          border: none;
          color: #1f1f1f;
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 1rem;
          margin-bottom: 2rem;
          width: 70%;
          height: 40%;
          resize: none;
        }

        @keyframes animated-text {
        from { width: 0; }
        to { width: var(--word-length-char); }
      }

      @keyframes animated-cursor {
        from { border-right-color: rgba(0, 102, 204, 0.8); }
        to { border-right-color: transparent; }
      }
                
      </style>

      <section class="submit-definition-page">
        

          <p>Time left to submit a definition</p>

          <progress-timer id="progress-timer" duration="120" running></progress-timer>

          <section class="word-container">

            <p class="word"></p>
              <label class = "def-instruction" for="definition-textarea">Type out your definition:</label>
              <textarea class="definition"></textarea>            
              <p id="success-message"></p>
          </section>

          <primary-button id="submit-definition">
            Submit
          </primary-button>
      </section>
    `;
  }

  startPollingForRoundStart() {
    this.pollingInterval = setInterval(async () => {
        const roundData = await apiFetch('games/current-round', {
          method: 'GET',
          showSpinner: false,
        });

        if (roundData) {
            if (roundData.roundStatus === 'Voting') {
                this.stopPollingForRoundStart();
                router.navigate('/game', { roundData: roundData });
            }
        }
    }, 3000);
  }

  stopPollingForRoundStart() {
      if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
      }
  }

  async fetchRoundData() {

    const roundData = await apiFetch('games/current-round', {
        method: 'GET',
      });

      this.shadow.querySelector(".word").textContent = roundData.word.word;

      const wordElem = this.shadow.querySelector(".word");
    const word = roundData.word.word;
    wordElem.textContent = word;

    // Set width in characters for the animation
    wordElem.style.setProperty('--word-length', word.length);
    wordElem.style.setProperty('--word-length-char', `${word.length}ch`);

    // Force reflow and re-trigger animation
    wordElem.classList.remove('animate');
    void wordElem.offsetWidth; // Trigger reflow
    wordElem.classList.add('animate');
  }

  async submitDefinition() {
    const definition = this.shadow.querySelector(".definition")?.value || '';
    const data = await apiFetch('games/definitions', {
      method: "POST",
      body: {
        definition,
      },
    });

    if (!data?.id) {
      showErrorScreen({
        onRetry: this.submitDefinition,
        message: "Failed to submit definition",
      });
    }

    else {
      const successMessage = this.shadow.querySelector("#success-message");
      this.submitDefinitionButton.setAttribute('disabled', true); 
      successMessage.textContent = "Great!, your definition was sumbitted, please wait for the other players to submit their definitions";
      this.startPollingForRoundStart();
    }
  }
}