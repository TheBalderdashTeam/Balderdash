export class BaseInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._validator = null;
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

  get value() {
    return this.shadowRoot.querySelector('input')?.value || '';
  }

  set validator(fn) {
    if (typeof fn === 'function') {
      this._validator = fn;
    }
  }

  attachEvents() {
    const input = this.shadowRoot.querySelector('input');
    if (input) {
      input.addEventListener('blur', () => this.validate());
    }
  }

  validate() {
    const errorElement = this.shadowRoot.querySelector('.error-message');
    if (!this._validator) return;

    const errorMessage = this._validator(this.value);
    errorElement.textContent = errorMessage || '';

    this.dispatchEvent(new CustomEvent('input-validation', {
      detail: { valid: !errorMessage },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const label = this.getAttribute('label') || '';
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const name = this.getAttribute('name') || '';
  
    const required = this.hasAttribute('required') ? 'required' : '';
    const minLength = this.getAttribute('minlength') || '';
    const maxLength = this.getAttribute('maxlength') || '';
    const pattern = this.getAttribute('pattern') || '';

    const containerAlignItems = this.getAttribute('containerAlignItems') || 'center';
  
    this.shadowRoot.innerHTML = `
      <style>
      
        :host {
          display: flex;
          width: 100%;
        }

        .input-wrapper { 
          display: flex; 
          flex-direction: column;
          flex: 1 0 auto;
          ${containerAlignItems && `align-items: ${containerAlignItems};`}
        }

        .error-message { 
          color: red; 
          font-size: 12px; 
          text-align: left;
        }

        input {
          box-shadow: rgba(81, 85, 183, 0.4) 5px 5px, rgba(81, 85, 183, 0.3) 10px 10px, rgba(81, 85, 183, 0.2) 15px 15px, rgba(81, 85, 183, 0.1) 20px 20px, rgba(81, 85, 183, 0.05) 25px 25px;
          border-radius: 8px;
          border: none;
          color: #1f1f1f;
          padding: 16px 0px;
          margin: 16px 0px 0px;
          font-size: 16px;
          font-weight: 500;
          width: 100%;
          flex: 1;
          max-width: 480px;
          text-align: center;
        }
      </style>
      <section class="input-wrapper">
        ${label ? `<label>${label}</label>` : ''}
        <input
          type="${type}"
          name="${name}"
          placeholder="${placeholder}"
          ${required}
          ${minLength && `minlength="${minLength}"`}
          ${maxLength && `maxlength="${maxLength}"`}
          ${pattern && `pattern="${pattern}"`}/>
        <p class="error-message"></p>
      </section>
    `;
  }
}

customElements.define('base-input', BaseInput);
