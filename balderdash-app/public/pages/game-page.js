import { loadHtmlIntoShadow } from '../js/helpers.js';
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

    async connectedCallback() {
        await this.render();
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

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/game-page.html');
        this.shadow.styleSheets[0].insertRule(`.game-page ${pageStyles}`, 0);
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

        if (this.selectedDefinitionId) {
            if (this.selectedDefinitionId !== `def-${this.roundData.word.id}`) {
                const incorrectSelection = this.shadow.querySelector(
                    `#${this.selectedDefinitionId}`
                );
                if (incorrectSelection) {
                    incorrectSelection.classList.add('incorrect');
                }
            }
        }
    }

    handleOptionClick(event) {
        event.preventDefault();
        this.selectedDefinitionId = event.currentTarget.id;
        if (this.selectedDefinitionId) {
            this.updateSelection();
        }
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
