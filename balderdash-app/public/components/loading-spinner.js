import { loadHtmlIntoShadow } from '../js/helpers.js';

export class LoadingSpinner extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
        this.style.display = 'none';
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/loading-spinner.html');
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('loading-spinner', LoadingSpinner);
