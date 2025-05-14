import { router } from '../router/index.js';
import { apiFetch, logoutUser } from '../js/apiClient.js';
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
          height: 100%;
          width: 100%;
          align-content: center;
        }

        .word {
          font-size: 25px;
          font-weight: bold;
          word-wrap: break-word;
          width: 100%;
        }

        p {
          text-align: center;
        }

        .submit-definition-page ${pageStyles}
        
      </style>

      <section class="submit-definition-page">
        

          <p>Time left to submit a definition</p>

          <progress-timer id="progress-timer" duration="120" running></progress-timer>

          <section class="word-container">

            <p class="word"></p>
      
            <base-input id="definition" label="Type out a fake definition"></base-input>
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
        }, null, false);

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
}

  async submitDefinition() {
    const definition = this.shadow.querySelector("#definition")?.value || '';
    const data = await apiFetch('games/definitions', {
      method: "POST",
    }, {
      definition,
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