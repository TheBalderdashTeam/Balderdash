import { BaseButton } from "./base-button.js";

/** The SecondaryButton class defines a custom button element with specific styling for a secondary button. */
export class SecondaryButton extends BaseButton {

  getStyles() {
      return `
    button {
      background-color: rgba(255,255,255,.70);
      color: #black;
    }

    button:hover:not(:disabled) {
        background-color: #6666c3;
        color: #ffffff;
    }
  `;
  }
}

customElements.define('secondary-button', SecondaryButton);
