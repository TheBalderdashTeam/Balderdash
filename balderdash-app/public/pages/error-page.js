import { loadHtmlIntoShadow } from '../js/helpers.js';
import { pageStyles } from '../js/styles.js';

export class ErrorPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._message = 'An unexpected error occurred. Please try again.';
        this._onRetry = null;
        this._onDismiss = null;
    }

    async connectedCallback() {
        await this.render();

        this.shadowRoot.getElementById('dismissBtn').onclick = () => {
            if (typeof this._onDismiss === 'function') {
                this._onDismiss();
            }
        };

        if (this.shadowRoot.getElementById('retryBtn')) {
            this.shadowRoot.getElementById('retryBtn').onclick = () => {
                if (typeof this._onRetry === 'function') {
                    this._onRetry();
                }
            };
        }
    }

    set errorMessage(msg) {
        this._message = msg;
        this.render();
    }

    set onRetry(callback) {
        this._onRetry = callback;
    }

    set onDismiss(callback) {
        this._onDismiss = callback;
    }

    async render() {
        await loadHtmlIntoShadow(this.shadowRoot, '../html/error-page.html');
        this.shadowRoot.styleSheets[0].insertRule(`:host ${pageStyles}`, 0);
    }
}
