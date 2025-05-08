export class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.style.display = 'none';
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #007bff;
          width: 50px;  
          height: 50px; 
          animation: spin 1s linear infinite;
          margin: 10px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          position: absolute; /* Important:  Position absolutely within its parent */
          top: 0;
          left: 0;
          background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
          z-index: 1000; /* Ensure it's on top of other content */
        }
      </style>
      <div class="loading-overlay">
        <div class="spinner"></div>
      </div>
    `;
  }

  show() {
     this.style.display = 'block';
  }

  hide() {
      this.style.display = 'none';
  }
}

customElements.define('loading-spinner', LoadingSpinner);
