import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class ReJoinGamePage extends HTMLElement {
    constructor(sourceUrl) {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.sourceUrl = sourceUrl;
    }

    async connectedCallback() {
        await this.render();

        const joinGameButton =
            this.shadowRoot.querySelector('#join-game-button');

        joinGameButton.addEventListener('click', () => {
            this.onJoinGameClick();
        });

        const leaveGameButton =
            this.shadowRoot.querySelector('#leave-game-button');

        leaveGameButton.addEventListener('click', () => {
            this.onLeaveGameClick();
        });
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/rejoin-game-page.html');
        this.shadow.styleSheets[0].insertRule(
            `.join-game-page ${pageStyles}`,
            0
        );
    }

    async onJoinGameClick() {
        const gameData = await apiFetch('games', {
            method: 'GET',
        });

        if (gameData) {
            router.navigate('/lobby');
        }
    }

    async onLeaveGameClick() {
        await apiFetch('games/leave', {
            method: 'POST',
        });

        router.navigate(this.sourceUrl || '/home');
    }
}
