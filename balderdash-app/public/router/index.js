class RouterService {
  constructor(outletSelector = '#app') {
      this.routes = {};
      this.outletElement = document.querySelector(outletSelector);
      
      if (!this.outletElement) {
          throw new Error(`Router outlet not found: ${outletSelector}`);
      }

      // Handle browser back/forward
      window.addEventListener('popstate', (event) => {
        this.handleRouteChange(window.location.pathname || '/', event.state);
      });      
      // Delegate link clicks
      document.addEventListener('click', (e) => {
          const link = e.target.closest('a[data-route]');
          if (link) {
              e.preventDefault();
              const path = link.getAttribute('href');
              const state = {...link.dataset};
              console.log({path, state})
              this.navigate(path, state);
          }
      });

      this.handleRouteChange();
  }

  addRoute(path, component) {
      this.routes[path] = component;
  }

  navigate(path, data = {}) {
      window.history.pushState(data, '', path);
      this.handleRouteChange(path,data);
  }

  handleRouteChange(newPath , routeData = {}) {
      if (!this.outletElement) return;

      const path = newPath?.substring(1) || 'home'; 
      
      if (this.routes[path]) {
          this.outletElement.innerHTML = '';
          this.routes[path](routeData);
      } else if (this.routes['404']) {
          this.outletElement.innerHTML = '';
          this.routes['404']();
      } else {
          this.outletElement.innerHTML = '<h1>404 - Page Not Found</h1>';
      }
  }
}

export const router = new RouterService();