import { loadHtmlIntoShadow } from '../js/helpers.js';

export class BaseInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._validator = null;
    }

    async connectedCallback() {
        await this.render();
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

        this.dispatchEvent(
            new CustomEvent('input-validation', {
                detail: { valid: !errorMessage },
                bubbles: true,
                composed: true,
            })
        );
    }

    async render() {
        await loadHtmlIntoShadow(this.shadowRoot, '../html/base-input.html');
        // Set label and input attributes after HTML is loaded
        const label = this.getAttribute('label') || '';
        const type = this.getAttribute('type') || 'text';
        const placeholder = this.getAttribute('placeholder') || '';
        const name = this.getAttribute('name') || '';
        const required = this.hasAttribute('required');
        const minLength = this.getAttribute('minlength') || '';
        const maxLength = this.getAttribute('maxlength') || '';
        const pattern = this.getAttribute('pattern') || '';
        const containerAlignItems =
            this.getAttribute('containerAlignItems') || 'center';

        const labelEl = this.shadowRoot.getElementById('input-label');
        const inputEl = this.shadowRoot.getElementById('input-field');
        if (label) {
            labelEl.textContent = label;
            labelEl.style.display = '';
        } else {
            labelEl.style.display = 'none';
        }
        inputEl.type = type;
        inputEl.name = name;
        inputEl.placeholder = placeholder;
        if (required) inputEl.required = true;
        if (minLength) inputEl.minLength = minLength;
        if (maxLength) inputEl.maxLength = maxLength;
        if (pattern) inputEl.pattern = pattern;
        this.shadowRoot
            .querySelector('.input-wrapper')
            .style.setProperty('--container-align-items', containerAlignItems);
    }
}

customElements.define('base-input', BaseInput);
