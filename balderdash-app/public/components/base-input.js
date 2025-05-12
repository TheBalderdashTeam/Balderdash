export class BaseInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  get value() {
    return this.shadowRoot.querySelector('input')?.value || '';
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
          height: 1em; 
        }

        input {
          border: 3px solid #93ff9a;
          border-radius: 8px;
          padding: 16px 0px;
          margin: 16px 0px;
          font-size: 16px;
          font-weight: 500;
          width: 100%;
          flex: 1;
          max-width: 480px;
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
