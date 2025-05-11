export class BaseButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.button = this.shadow.querySelector('button');
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name) {
    if (name === 'disabled') {
      this.updateDisabledState();
    }
  }

  connectedCallback() {
    this.updateDisabledState(); // Ensure button is set correctly on attach
  }

  updateDisabledState() {
    this.button.disabled = this.hasAttribute('disabled');
  }

  render() {
    this.shadow.innerHTML = `
      <style>
      
        :host {
          display: inline-block;
        }

        button {
          border: 3px solid #93ff9a;
          border-radius: 8px;
          padding: 16px 16px;
          margin: 16px 0px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 480px;
          font-family: 'Roboto', sans-serif;
        }

        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          :host {
            display: block;
            width: 100%;
          }
          button {
            width: 100%;
            min-width: auto;
          }
        }

        ${this.getStyles?.() || ''}
      </style>
      <button part="button">
        <slot></slot>
      </button>
    `;
  }
}
