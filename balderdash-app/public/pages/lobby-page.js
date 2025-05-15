import { pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class LobbyPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.pollingInterval = null;
    }

    async connectedCallback() {
        await this.render();
        this.init();
    }

    async init() {
        await this.getGameInfo();
        this.startPollingForGameStart();
    }

    disconnectedCallback() {
        this.stopPollingForGameStart();
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/lobby-page.html');
        this.shadow.styleSheets[0].insertRule(`.lobby-page ${pageStyles}`, 0);
    }

    async getGameInfo() {
        const gameData = await apiFetch('games', {
            method: 'GET',
        });

        const userData = await apiFetch('user', {
            method: 'GET',
        });

        if (gameData) {
            this.lobbyCode = gameData.game.lobbyCode;
        }

        //Check game state to see if the player is on the correct page
        if (gameData.game.hostUserId === userData.id) {
            router.navigate('/host-lobby');
        }
    }

    startPollingForGameStart() {
        this.pollingInterval = setInterval(async () => {
            const gameData = await apiFetch('games', {
                method: 'GET',
                showSpinner: false,
            });

            if (gameData) {
                if (gameData.status === 'Active') {
                    this.stopPollingForGameStart();
                    router.navigate('/submit-definition', { game: gameData });
                }
            }
        }, 3000);
    }

    stopPollingForGameStart() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}
