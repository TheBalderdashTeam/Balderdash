import { loadHtmlIntoShadow } from '../js/helpers.js';

export class BaseButton extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.button = null;
    }

    static get observedAttributes() {
        return ['disabled'];
    }

    attributeChangedCallback(name) {
        if (name === 'disabled') {
            this.updateDisabledState();
        }
    }

    async connectedCallback() {
        await this.render();
        this.button = this.shadow.querySelector('button');
        this.updateDisabledState();
    }

    updateDisabledState() {
        this.button.disabled = this.hasAttribute('disabled');
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/base-button.html');
        this.button = this.shadow.querySelector('button');
        this.updateDisabledState();
        if (this.getStyles && typeof this.getStyles === 'function') {
            const extraStyles = this.getStyles();
            if (extraStyles) {
                const styleEl = document.createElement('style');
                styleEl.textContent = extraStyles;
                this.shadow.appendChild(styleEl);
            }
        }
    }
}
