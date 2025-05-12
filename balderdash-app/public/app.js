import { router } from '../router/index.js';
import { LoadingSpinner } from '../components/loading-spinner.js';
import {
  HomePage,
  AuthPage,
  RankingPage,
  LobbyPage,
  JoinGamePage,
  ErrorPage,
  GameSettingsPage,
} from './pages/index.js';

// Register Web Components
customElements.define('home-page', HomePage);
customElements.define('auth-page', AuthPage);
customElements.define('ranking-page', RankingPage);
customElements.define('lobby-page', LobbyPage);
customElements.define('join-game-page', JoinGamePage);
customElements.define('error-page', ErrorPage);
customElements.define('game-settings-page', GameSettingsPage);

// Configure Routes
router.addRoute('home', () => {
  const homePage = new HomePage();
  document.querySelector('#app').appendChild(homePage);
});

router.addRoute('sign-in', () => {
  const authPage = new AuthPage();
  document.querySelector('#app').appendChild(authPage);
});

router.addRoute('results', () => {
  const rankingPage = new RankingPage();
  rankingPage.pageHeading = 'Game Results'
  document.querySelector('#app').appendChild(rankingPage);
});

router.addRoute('leaderboard', () => {
  const rankingPage = new RankingPage();
  rankingPage.isLeaderBoard = true;
  rankingPage.pageHeading = 'Leaderboard'
  document.querySelector('#app').appendChild(rankingPage);
});

router.addRoute('game-settings', () => {
  const gameSettingsPage = new GameSettingsPage();
  document.querySelector('#app').appendChild(gameSettingsPage);
});

router.addRoute('lobby', () => {
  const lobbyPage = new LobbyPage();
  document.querySelector('#app').appendChild(lobbyPage);
});

router.addRoute('join-game', () => {
  const joinGamePage = new JoinGamePage();
  document.querySelector('#app').appendChild(joinGamePage);
});

// Initialize router
router.navigate(window.location.pathname || '/');