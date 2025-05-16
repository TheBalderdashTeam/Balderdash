import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { BaseInput } from '../components/base-input.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';
import { getItem } from '../js/storage.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class RankingPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.rankingData = null;
        this.isLeaderBoard = false;
        this.pageHeading = 'Game Results';
        this.hostUserId = null;
        this.roundEnded = false;
    }

    async connectedCallback() {
        await this.render();
        await this.init();

        if (!this.isLeaderBoard) {
            await this.endRound();
        }
    }

    async init() {
        const heading = this.shadowRoot.querySelector('.leaderboard-title');

        heading.textContent = this.pageHeading;

        if (!this.rankingData) {
            const data = await this.fetchRankingData();

            if (!this.isLeaderBoard) {
                const gameData = await apiFetch('games', {
                    method: 'GET',
                    showSpinner: false,
                });
                this.hostUserId = gameData.game.hostUserId;
            }
            this.rankingData = data;

            if (!Array.isArray(this.rankingData)) {
                this.rankingData = [];
            }
        }

        this.updateContent();
    }

    rowContainerStyling = `
    padding="1em 1em"
    borderRadius="5px"
  `;

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/ranking-page.html');
        this.shadow.styleSheets[0].insertRule(
            `.leaderboard-page ${pageStyles}`,
            0
        );
    }

    getRowColor(index) {
        const baseHue = 231;
        const saturation = 50;
        const lightnessBase = 85;
        const lightnessStep = 6;

        // Decrease lightness gradually to create distinct shades
        const lightness = Math.max(20, lightnessBase - index * lightnessStep);

        return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    }

    async fetchRankingData() {
        const apiEndpoint =
            (this.isLeaderBoard && 'leaderboard') || 'games/get-round-scores';
        const data = await apiFetch(apiEndpoint, {
            method: 'GET',
            showSpinner: false,
        });

        if (!data) {
            return {};
        }

        return data;
    }

    async endRound() {
        let currentUserId = getItem('user-data')?.id;

        if (!currentUserId) {
            const userData = await apiFetch('user', {
                showSpinner: false,
            });

            currentUserId = userData.id;
        }

        setTimeout(async () => {
            if (currentUserId === this.hostUserId && !this.roundEnded) {
                await apiFetch('games/end-round', {
                    method: 'POST',
                    showSpinner: false,
                });
                this.roundEnded = true;
            }

            setTimeout(async () => {
                const response = await fetch(
                    window.location.origin + '/place-user',
                    {
                        method: 'GET',
                    }
                );

                if (response.redirected) {
                    window.location.href = response.url;
                }
            }, 1000);
        }, 5000);
    }

    async updateContent() {
        const container = this.shadowRoot.querySelector('#ranking-rows');

        if (!container || !Array.isArray(this.rankingData)) {
            return;
        }

        container.innerHTML = '';

        this.rankingData.forEach((entry, index) => {
            const row = document.createElement('horizontal-container-v');

            row.setAttribute('backgroundColour', this.getRowColor(index));
            row.setAttribute('padding', '15px 20px');
            row.setAttribute('borderRadius', '5px');
            row.setAttribute('style', 'margin-bottom: 1rem;');

            const score =
                (this.isLeaderBoard && entry.totalScore) || entry.currentScore;
            row.innerHTML = `
        <section class="rank">${index + 1}</section>
        <section class="player">${entry.username}</section>
        <section class="score">${score ?? 0}</section>
      `;

            container.appendChild(row);
        });
    }
}
