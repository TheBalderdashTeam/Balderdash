import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { showErrorScreen } from '../js/helpers.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class JoinGamePage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.isValidInput = false;
        this.lobbyCodeInput = null;
    }

    async connectedCallback() {
        await this.render();
        this.getGameInfo();

        const joinGameButton =
            this.shadowRoot.querySelector('#join-game-button');
        this.lobbyCodeInput = this.shadowRoot.querySelector('#lobby-code');

        this.lobbyCodeInput.validator = this.validateLobbyCode;

        this.lobbyCodeInput.addEventListener('input-validation', (event) => {
            this.isValidInput = event.detail.valid;
            if (this.isValidInput) {
                joinGameButton.removeAttribute('disabled');
            } else {
                joinGameButton.setAttribute('disabled', true);
            }
        });

        joinGameButton.addEventListener('click', () => {
            this.onJoinGameClick();
        });
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/join-game-page.html');
        this.shadow.styleSheets[0].insertRule(
            `.join-game-page ${pageStyles}`,
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
                sourceUrl: '/join-game',
            });
        }
    }

    validateLobbyCode(lobbyCode) {
        if (!lobbyCode) {
            return 'Please enter a lobby code to continue.';
        }

        if (lobbyCode.length < 8) {
            return 'Lobby code must be 8 characters.';
        }
        return '';
    }

    async onJoinGameClick() {
        if (this.isValidInput) {
            const lobbyCode = this.lobbyCodeInput?.value;
            const success = await apiFetch(`games/${lobbyCode}`, {
                method: 'POST',
            });

            if (success) {
                router.navigate('/lobby');
            } else {
                showErrorScreen({
                    message: 'Invalid Lobby Code',
                });
            }
        }
    }
}
