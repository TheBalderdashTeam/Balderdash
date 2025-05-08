import { router } from '../router/index.js';
import { HomePage } from '../pages/home-page.js';
import { LoadingSpinner } from '../components/loading-spinner.js';

// Register Web Components
customElements.define('home-page', HomePage);

// Configure Routes
router.addRoute('home', (data) => {
  const homePage = new HomePage();
  homePage.routeData = data;
  document.querySelector('#app').appendChild(homePage);
});

// Initialize router
router.navigate(window.location.pathname || '/');