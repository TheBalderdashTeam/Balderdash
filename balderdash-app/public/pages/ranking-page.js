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
    this.pageHeading = 'Game Results'
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  async init() {
    const data = await this.fetchRankingData();
    this.rankingData = data.data;

    if (!Array.isArray(this.rankingData)) {
      this.rankingData = [];
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
          maxWidth="482px">

          <h1 class="leaderboard-title">${this.pageHeading}</h1>
          
          <section id="ranking-rows"></section>  
        </vertical-container-v>
      </section>
    `;
  }

  getRowColor(index) {
    const colors = ['#3f51b5', '#f44336', '#e6a817', '#9c27b0', '#4caf50'];
    return colors[index % colors.length];
  }

  async fetchRankingData() {

    return {data: [
      { name: 'Alice', score: 120 },
      { name: 'Bob', score: 110 },
      { name: 'Charlie', score: 95 },
      { name: 'Ivan', score: 50 },
      { name: 'Jade', score: 45 }
    ]}

    const response = await apiFetch('rounds/games/1/current-round', {
      method: "GET",
    })

    if (!response) {
      return {}
    }

    const data = await response.json();

    return data;
  }

  async updateContent() {
    const container = this.shadowRoot.querySelector('#ranking-rows');
    if (!container || !Array.isArray(this.rankingData)) return;
  
    container.innerHTML = ''; // Clear previous rows
    this.rankingData = this.rankingData.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

    this.rankingData.forEach((entry, index) => {
      
      const row = document.createElement('horizontal-container-v');
  
      row.setAttribute('backgroundColour', this.getRowColor(index));
      row.setAttribute('padding', '15px 20px');
      row.setAttribute('borderRadius', '5px');
  
      
      row.innerHTML = `
        <section class="rank">${index + 1}</section>
        <section class="player">${entry.name}</section>
        <section class="score">${entry.score}</section>
      `;
  
      container.appendChild(row);
    });
  }
}