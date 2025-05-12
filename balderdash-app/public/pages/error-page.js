import {
  PrimaryButton,
  SecondaryButton,
} from "../components/index.js";
import { pageStyles } from "../js/styles.js";

export class ErrorPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._message = 'An unexpected error occurred. Please try again.';
    this._onRetry = null;
    this._onDismiss = null;

  }

  connectedCallback() {
    this.render();
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

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host ${pageStyles}

        h2 {
          margin: 0 0 10px 0;
        }
        p {
          margin: 0 0 16px 0;
        }

      </style>
      <vertical-container-h class="error-page"
        backgroundColour="#f8d7da"
        borderRadius="8px"
        padding="16px"
        maxWidth="500px">
        <h2>Something went wrong</h2>
        <p>${this._message}</p>
        <primary-button id="retryBtn">Retry</primary-button>
        <secondary-button id="dismissBtn">Dismiss</secondary-button>
      <vertical-container-h>

    `;

    this.shadowRoot.getElementById('dismissBtn').onclick = () => {
      if (typeof this._onDismiss === 'function') {
        this._onDismiss();
      }
    };

    this.shadowRoot.getElementById('retryBtn').onclick = () => {
      if (typeof this._onRetry === 'function') {
        this._onRetry();
      }
    };
  }
}