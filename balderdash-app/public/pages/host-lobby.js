import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';
export class HostLobbyPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.pollingInterval = null;
        this.waitingPlayers = 0;
        this.lobbyCode = '';
    }

    connectedCallback() {
        this.init();
    }

    async init() {
        await this.getGameInfo();
        this.render();
        this.startPollingForPlayers();
    }

    disconnectedCallback() {
        this.stopPollingForPlayers();
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/host-lobby.html');
        this.shadow.styleSheets[0].insertRule(`.lobby-page ${pageStyles}`, 0);
        // Set dynamic content after HTML is loaded
        this.shadow.getElementById('lobby-code').textContent = this.lobbyCode;
        this.shadow.getElementById('waiting-players').textContent =
            this.waitingPlayers;
        const startGameButton = this.shadow.getElementById('start-game-button');
        startGameButton.addEventListener('click', () => {
            this.startGame();
        });
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
        if (gameData.game.hostUserId !== userData.id) {
            this.stopPollingForPlayers();
            router.navigate('/lobby');
        }
    }

    async startGame() {
        try {
            const response = await apiFetch('games/start', {
                method: 'POST',
            });

            if (response || response.game) {
                const data = await response.game;

                this.stopPollingForPlayers();
                router.navigate('/submit-definition', { game: data });
            } else {
                this.stopPollingForPlayers();
            }
        } catch (error) {
            this.stopPollingForPlayers();
        }
    }

    startPollingForPlayers() {
        this.pollingInterval = setInterval(async () => {
            this.updatePlayerCount();
        }, 3000);
    }

    async updatePlayerCount() {
        const response = await apiFetch('user/all-players', {
            method: 'GET',
            showSpinner: false,
        });

        if (response) {
            if (this.waitingPlayers !== response.length) {
                this.waitingPlayers = response.length;
                this.render();
            }
        }
    }

    stopPollingForPlayers() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}
