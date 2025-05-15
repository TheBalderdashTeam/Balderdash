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
import { getItem } from '../js/storage.js';

export class GamePage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.roundData = null;
        this.roundWord = '';
        this.selectedDefinitionId = '';
        this.timeLimit = null;
        this.timer = null;
        this.hostUserId = null;
        this.handleOptionClick = this.handleOptionClick.bind(this);
    }

    connectedCallback() {
        this.render();
        this.init();

        this.timer = this.shadow.querySelector('progress-timer');

        this.timer.addEventListener('timer-end', (_) => {
            const allOptions = this.shadow.querySelectorAll('.option');
            allOptions.forEach((def) => {
                def.removeEventListener('click', this.handleOptionClick);
            });
            this.submitAnswer();
        });
    }

    disconnectedCallback() {
        this.startPollingForRoundState();
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
          transition: background-color 0.2s;
          min-height: 80px; 
          min-width: 180px;
          display: flex;
          flex: 1;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
      }

      .option.selected {
        background-color: #a3c4f3; /* Or any color you prefer */
        border: 2px solid #5a8dee;
      }
      
      .option.correct {
        background-color:rgb(163, 243, 178); /* Or any color you prefer */
        border: 2px solid rgb(90, 238, 117);

      }

      .option.incorrect {
        background-color:rgb(243, 163, 163); /* Or any color you prefer */
        border: 2px solid rgb(238, 90, 90);
      }

      .word-time {
        position: sticky;
        top: 0;
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
          <progress-timer></progress-timer>
          <p class="word"></p>
          <p>Select the correct definition below</p>
      </vertical-container-h>

      <ul class="options-container"></ul>

    </section>
  `;
    }

    startPollingForRoundState() {
        this.pollingInterval = setInterval(async () => {
            const roundData = await apiFetch('games/current-round', {
                method: 'GET',
                showSpinner: false,
                errorOnFail: false,
            });

            if (roundData) {
                if (roundData.roundStatus === 'Scoring') {
                    this.stopPollingForRoundState();
                    router.navigate('/results');
                }
            }
        }, 3000);
    }

    stopPollingForRoundState() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    async submitAnswer() {
        const correctDefinitionId = `def-${this.roundData.word.id}`;
        const isCorrect = this.selectedDefinitionId === correctDefinitionId;
        await apiFetch(`votes/`, {
            method: 'POST',
            body: {
                roundDefinitionId:
                    (!isCorrect && this.selectedDefinitionId.split('-')[1]) ||
                    '',
                isCorrect,
            },
        });
        this.showResults();
        await this.endRound();
    }

    async endRound() {
        const currentUserId = getItem('user-data')?.id;

        if (currentUserId === this.hostUserId) {
            setTimeout(() => {
                apiFetch('games/scoring', {
                    method: 'POST',
                });
            }, 3000);
        }

        this.startPollingForRoundState();
    }

    async fetchRoundData() {
        const fetchRequests = [apiFetch('games', { method: 'GET' })];

        let needsRoundData = false;

        if (!this.roundData) {
            fetchRequests.push(
                apiFetch('games/current-round', { method: 'GET' })
            );
            needsRoundData = true;
        }

        const results = await Promise.all(fetchRequests);

        const gameData = results[0];
        const roundData = needsRoundData ? results[1] : this.roundData;

        if (!roundData || !gameData) {
            return;
        }

        this.hostUserId = gameData.game.hostUserId;
        this.roundData = roundData;
        this.timeLimit = gameData.game.timeLimitSeconds;
        this.roundWord = this.roundData.word.word;
    }

    updateSelection() {
        const allOptions = this.shadow.querySelectorAll('.option');
        allOptions.forEach((opt) => opt.classList.remove('selected'));
        const selected = this.shadow.querySelector(
            `#${this.selectedDefinitionId}`
        );

        if (selected) {
            selected.classList.add('selected');
        }
    }

    showResults() {
        const correctDefinition = this.shadow.querySelector(
            `#def-${this.roundData.word.id}`
        );
        correctDefinition.classList.add('correct');

        if (this.selectedDefinitionId !== `def-${this.roundData.word.id}`) {
            const incorrectSelection = this.shadow.querySelector(
                `#${this.selectedDefinitionId}`
            );
            if (incorrectSelection) {
                incorrectSelection.classList.add('incorrect');
            }
        }
    }

    handleOptionClick(event) {
        event.preventDefault();
        this.selectedDefinitionId = event.currentTarget.id;
        this.updateSelection();
    }

    updateContent() {
        if (Array.isArray(this.roundData?.definitions)) {
            this.shadow.querySelector('.word').textContent =
                this.roundData.word.word;
            const optionsContainer =
                this.shadow.querySelector('.options-container');
            const allDefinitions = [
                ...this.roundData.definitions,
                this.roundData.word,
            ];
            allDefinitions.sort(() => Math.random() - 0.5);

            allDefinitions.forEach((def, _) => {
                const definition = document.createElement('li');
                definition.className = 'option';
                definition.id = `def-${def.id}`;
                definition.innerHTML = `<p>${def.definition}</p>`;

                definition.addEventListener('click', this.handleOptionClick);

                optionsContainer.appendChild(definition);
            });

            this.timer.setAttribute('duration', this.timeLimit);
            this.timer.setAttribute('running', true);
        }
    }
}
