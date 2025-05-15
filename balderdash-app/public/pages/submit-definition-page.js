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
import { showErrorScreen, loadHtmlIntoShadow } from '../js/helpers.js';

export class SubmitDefinitionPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.roundData = null;
        this.submitDefinitionButton = null;
    }

    async connectedCallback() {
        await this.init();
    }

    async init() {
        if (!this.roundData) {
            await this.fetchRoundData();
        }

        await this.render();
        this.updateContent();

        this.submitDefinitionButton =
            this.shadow.querySelector('#submit-definition');
        const timer = this.shadow.querySelector('#progress-timer');

        timer.addEventListener('timer-end', (event) => {
            this.submitDefinition();
        });

        this.submitDefinitionButton.addEventListener('click', (_) => {
            timer.removeAttribute('running');
            this.submitDefinition();
        });
    }

    disconnectedCallback() {
        this.stopPollingForRoundStart();
    }

    async render() {
        await loadHtmlIntoShadow(
            this.shadow,
            '../html/submit-definition-page.html'
        );
        this.shadow.styleSheets[0].insertRule(
            `.submit-definition-page ${pageStyles}`,
            0
        );
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

    updateContent() {
        const wordElem = this.shadow.querySelector('.word');
        wordElem.textContent = this.roundData.word.word;
        wordElem.style.setProperty(
            '--word-length',
            this.roundData.word.word.length
        );
        wordElem.style.setProperty(
            '--word-length-char',
            `${this.roundData.word.word.length}ch`
        );

        wordElem.classList.remove('animate');
        void wordElem.offsetWidth; // Trigger reflow
        wordElem.classList.add('animate');
    }

    async fetchRoundData() {
        this.roundData = await apiFetch('games/current-round', {
            method: 'GET',
        });

        if (!this.roundData) {
            router.navigate('/home');
        }
    }

    async submitDefinition() {
        const definition =
            this.shadow.querySelector('.definition')?.value || '';
        const data = await apiFetch('games/definitions', {
            method: 'POST',
            body: {
                definition,
            },
        });

        if (!data?.id) {
            showErrorScreen({
                onRetry: this.submitDefinition,
                message: 'Failed to submit definition',
            });
        } else {
            const successMessage =
                this.shadow.querySelector('#success-message');
            this.submitDefinitionButton.setAttribute('disabled', true);
            successMessage.textContent =
                'Great!, your definition was sumbitted, please wait for the other players to submit their definitions';
            this.startPollingForRoundStart();
        }
    }
}
