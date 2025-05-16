import { loadHtmlIntoShadow } from '../js/helpers.js';

export class BaseContainer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
        this.backgroundColour = this.getAttribute('backgroundColour') || '';
        this.margin = this.getAttribute('margin') || '';
        this.borderRadius = this.getAttribute('borderRadius') || '';
        this.padding = this.getAttribute('padding') || '';
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/base-container.html');
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
