import { BaseContainer } from "./base-container.js";
import { hexToRgba } from "../js/helpers.js";

/** 
 * The VerticalContainerH class extends BaseContainer and sets the flex-direction to column with center
 * alignment for both justify-content and align-items.
 * 
 * Elements placed in this container will be stacked vertically and horizontally centered
 *
 * <strong>Custom element tag</strong>: \<vertical-container-h\>
 * 
 * <strong>Supported attributes</strong>:
 * - background-color (CSS color value) in RGBA format to allow opacity
 * - margin (CSS margin value)
 * - borderRadius (CSS border-radius value)
 * - padding (CSS padding value)
 * - maxWidth (CSS max-width value)
 * - minHeight (CSS min-height value)
 * - alpha (Number between 0 and 1 used to control background color opacity- default=1)
 */
export class VerticalContainerH extends BaseContainer {

  static get observedAttributes() {
    return ['backgroundcolour', 'margin', 'borderradius', 'padding', 'maxwidth', 'minheight', 'alpha'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  getStyles() {

    const backgroundColour = this.getAttribute('backgroundColour') || '';
    const margin = this.getAttribute('margin') || '';
    const borderRadius = this.getAttribute('borderRadius') || '';
    const padding = this.getAttribute('padding') || '';
    const maxWidth = this.getAttribute('maxWidth') || '';
    const minHeight = this.getAttribute('minHeight') || '';
    const alpha = this.getAttribute('alpha') || 1;
    const hostHeight = this.getAttribute('hostHeight') || '';
    const justifyContent = this.getAttribute('justifyContent') || 'center';

    return `
    :host {
      display: flex;
      justify-content: center;
      ${hostHeight ? `height: ${hostHeight};` : ''}
    }

    :host([noShadow]) .container{
      box-shadow: none;
      animation: none;
    }

    .container {
      flex: 1 0 auto;
      flex-direction: column;
      align-items: center;
      ${justifyContent ? `justify-content: ${justifyContent};` : ''}
      ${backgroundColour ? `background-color: ${hexToRgba(backgroundColour, alpha)};` : ''}
      ${margin ? `margin: ${margin};` : ''}
      ${padding ? `padding: ${padding};` : ''}
      ${borderRadius ? `border-radius: ${borderRadius};` : ''}
      ${maxWidth ? `max-width: ${maxWidth};` : ''}
      ${minHeight ? `min-height: ${minHeight};` : ''}

    }
  `;
  }  
}

customElements.define('vertical-container-h', VerticalContainerH);