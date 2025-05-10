import { router } from '../router/index.js';
import { HomePage } from '../pages/home-page.js';
import { AuthPage } from '../pages/auth-page.js';
import { LoadingSpinner } from '../components/loading-spinner.js';

// Register Web Components
customElements.define('home-page', HomePage);
customElements.define('auth-page', AuthPage);

// Configure Routes
router.addRoute('home', (data) => {
  const homePage = new HomePage();
  homePage.routeData = data;
  document.querySelector('#app').appendChild(homePage);
});

router.addRoute('login', (data) => {
  const authPage = new AuthPage();
  authPage.routeData = data;
  document.querySelector('#app').appendChild(authPage);
});

// Initialize router
router.navigate(window.location.pathname || '/');