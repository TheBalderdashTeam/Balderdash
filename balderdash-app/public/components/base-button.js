export class BaseButton extends HTMLElement {
  constructor() {
      super();
      this.handleClick = (event) => {
          if (this.hasAttribute('disabled')) {
              event.stopPropagation();
              event.preventDefault();
          }
      };
      this.shadow = this.attachShadow({ mode: 'open' });
      this.render();
      this.button = this.shadow.querySelector('button');
  }
  // Shared properties
  static get observedAttributes() {
      return ['disabled'];
  }
  // Shared methods
  attributeChangedCallback(name) {
      if (name === 'disabled')
          this.updateDisabledState();
  }
  connectedCallback() {
      this.button.addEventListener('click', this.handleClick);
  }
  disconnectedCallback() {
      this.button.removeEventListener('click', this.handleClick);
  }
  updateDisabledState() {
      this.button.disabled = this.hasAttribute('disabled');
  }
  // Shared render method
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

      ${this.getStyles()}
    </style>
    <button part="button">
      <slot></slot>
    </button>
  `;
  }
}
