import { BaseButton } from "./base-button.js";

/** The PrimaryButton class defines a custom button element with specific styling for a primary button. */
export class PrimaryButton extends BaseButton {

  getStyles() {
      return `
    button {
      background-color: #93ff9a;
      color: #black;
    }

    button:hover:not(:disabled) {
        background-color: #ffffff;
    }
  `;
  }
}

customElements.define('primary-button', PrimaryButton);
