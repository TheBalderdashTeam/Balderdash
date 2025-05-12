import { BaseButton } from "./base-button.js";

/** The PrimaryButton class defines a custom button element with specific styling for a primary button. */
export class PrimaryButton extends BaseButton {

  getStyles() {
      return `
    button {
      background-color: #6666c3;
      color: #ffffff;
      align-self: 
    }

    button:hover:not(:disabled) {
        background-color: rgba(255,255,255,.70);
        color: #19191f;
    }
  `;
  }
}

customElements.define('primary-button', PrimaryButton);
