import { loadHtmlIntoShadow } from '../js/helpers.js';

export class AuthPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.render();

        const loginButton = this.shadow.querySelector('#google-login-button');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.handleGoogleLogin();
            });
        }
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/auth-page.html');
    }

    async handleGoogleLogin() {
        window.location.href = '/auth/google';
    }
}
