import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton, BaseInput } from '../components/index.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class GameSettingsPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        await this.render();
        this.getGameInfo();

        const createGameButton = this.shadowRoot.querySelector(
            '#create-game-button'
        );

        if (createGameButton) {
            createGameButton.addEventListener('click', () => {
                const roundsInput = this.shadowRoot.querySelector('#rounds');
                const secondsInput = this.shadowRoot.querySelector('#seconds');

                if (roundsInput && secondsInput) {
                    const rounds = roundsInput.value;
                    const seconds = secondsInput.value;

                    this.createGame(rounds, seconds);
                }
            });
        }

        const loginButton = this.shadowRoot.querySelector(
            '#google-login-button'
        );

        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.handleGoogleLogin();
            });
        }
    }

    async render() {
        await loadHtmlIntoShadow(
            this.shadow,
            '../html/game-settings-page.html'
        );
        this.shadow.styleSheets[0].insertRule(
            `.game-settings-page ${pageStyles}`,
            0
        );
    }

    async getGameInfo() {
        const gameData = await apiFetch('games', {
            method: 'GET',
            showSpinner: true,
            errorOnFail: false,
        });

        if (gameData) {
            router.navigate('/rejoin-game', {
                sourceUrl: '/game-settings',
            });
        }
    }

    async createGame(round, seconds) {
        try {
            const response = await apiFetch('games', {
                method: 'POST',
                body: { numberRounds: round, timeLimitSeconds: seconds },
            });

            if (response || response.game) {
                const data = response.game;

                router.navigate('/lobby', { game: data });
            } else {
            }
        } catch (error) {}
    }

    async handleGoogleLogin() {
        window.location.href = '/auth/google';
    }
}
