import { BaseButton } from "./base-button.js";

/** The SecondaryButton class defines a custom button element with specific styling for a secondary button. */
export class SecondaryButton extends BaseButton {

  getStyles() {
      return `
    button {
      background-color: #ffffff;
      color: #black;
    }

    button:hover:not(:disabled) {
        background-color: #93ff9a;
    }
  `;
  }
}

customElements.define('secondary-button', SecondaryButton);
