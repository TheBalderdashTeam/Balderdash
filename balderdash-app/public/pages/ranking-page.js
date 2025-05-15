import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { BaseInput } from '../components/base-input.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';
import { pageStyles } from '../js/styles.js';

export class RankingPage extends HTMLElement {

  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.rankingData = null;
    this.isLeaderBoard = false;
    this.pageHeading = 'Game Results';
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  async init() {

    if (!this.rankingData) {
      
      const data = await this.fetchRankingData();
      this.rankingData = data;
  
      if (!Array.isArray(this.rankingData)) {
        this.rankingData = [];
      }
    }

    this.updateContent();
  }

  rowContainerStyling = `
    padding="15px 20px"
    borderRadius="5px"
  `

  render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: flex;
          box-sizing: border-box;
          flex: 1;
          position: relative; 
        }

        .leaderboard-page ${pageStyles}

        .leaderboard-title {
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
          color: #333;
        }

        horizontal-container-v {
          align-items: center;
          margin-bottom: 10px;
          color: white;
          font-weight: bold;
        }

        .rank {
            width: 10%;
            text-align: left;
        }

        .player {
            width: 60%;
            text-align: center;
        }

        .score {
            width: 10%;
            text-align: right;
        }

        #ranking-rows {
          width: 100%;
        }

      </style>
      
      <section class="leaderboard-page">
        <vertical-container-h 
          backgroundColour="rgba(255, 255, 255, 0.8)"
          padding="16px"
          borderRadius="10px"
          maxWidth="482px"
          justifyContent="flex-start"
          hostHeight="100%">

          <h1 class="leaderboard-title">${this.pageHeading}</h1>
          
          <section id="ranking-rows"></section>  
        </vertical-container-v>
      </section>
    `;
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


    const apiEndpoint = this.isLeaderBoard && 'leaderboard' || 'games/get-round-scores' ;
    const data = await apiFetch(apiEndpoint, {
      method: 'GET',
    }, null, false);

    setTimeout(async () => {
      const response = await fetch(window.location.origin+'/place-user', {
        method: 'GET',
      });

      if (response.redirected) {
            window.location.href = response.url;
        }

    }, 5000);

    // const gameData = await apiFetch('games');

    // if (gameData.status === 'Active') {
      
    //   const roundData = await apiFetch('games/current-round');

    //   router.navigate('submit-definition');
    // }
    if (!data) {
      return {}
    }

    return data;
  }

  async updateContent() {
    const container = this.shadowRoot.querySelector('#ranking-rows');

    if (!container || !Array.isArray(this.rankingData)) {
      return
    };
  
    container.innerHTML = '';

    this.rankingData.forEach((entry, index) => {
      
      const row = document.createElement('horizontal-container-v');
  
      row.setAttribute('backgroundColour', this.getRowColor(index));
      row.setAttribute('padding', '15px 20px');
      row.setAttribute('borderRadius', '5px');
      row.setAttribute('style', 'margin-bottom: 1rem;');

      const score = this.isLeaderBoard && entry.totalScore || entry.currentScore;
      row.innerHTML = `
        <section class="rank">${index + 1}</section>
        <section class="player">${entry.username}</section>
        <section class="score">${score}</section>
      `;
  
      container.appendChild(row);
    });
  }
}