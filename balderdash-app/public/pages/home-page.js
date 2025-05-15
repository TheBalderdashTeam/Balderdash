import { router } from '../router/index.js';
import { apiFetch, logoutUser } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';
import { setItem } from '../js/storage.js';
import {
    PrimaryButton,
    SecondaryButton,
    VerticalContainerH,
} from '../components/index.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.routeData = null;
        this.username = null;
    }

    async connectedCallback() {
        await this.render();
        this.fetchUserInfo();

        const startGameButton =
            this.shadowRoot.querySelector('#start-game-button');
        const joinGameButton =
            this.shadowRoot.querySelector('#join-game-button');
        const leaderboardButton = this.shadowRoot.querySelector(
            '#leaderboard-button'
        );
        const logoutButton = this.shadowRoot.querySelector('#logout-button');

        startGameButton.addEventListener('click', () => {
            this.onStartGameClick();
        });

        joinGameButton.addEventListener('click', () => {
            this.onJoinGameClick();
        });

        leaderboardButton.addEventListener('click', () => {
            this.onLeaderboardClick();
        });

        logoutButton.addEventListener('click', () => {
            this.onLogoutClick();
        });
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/home-page.html');
        this.shadow.styleSheets[0].insertRule(`.home-page ${pageStyles}`, 0);
    }

    async onJoinGameClick() {
        router.navigate('/join-game');
    }

    async onLogoutClick() {
        await logoutUser();
    }

    async onLeaderboardClick() {
        router.navigate('/leaderboard');
    }

    async onStartGameClick() {
        router.navigate('/game-settings');
    }

    async fetchUserInfo() {
        const userData = await apiFetch('user', {
            method: 'GET',
        });

        if (userData) {
            this.username = userData.username;
            setItem('user-data', userData);
            this.updateContent();
        }
    }

    updateContent() {
        const greeting = this.shadowRoot.querySelector('#greeting');

        greeting.innerHTML = '';

        greeting.innerHTML = `Welcome, ${this.username}`;
    }
}
