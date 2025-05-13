import { BaseContainer } from "./base-container.js";
import { hexToRgba } from "../js/helpers.js";

/** 
 * The HorizontalContainerV class extends BaseContainer and sets the flex-direction to row with center
 * alignment for both justify-content and align-items.
 * 
 * Elements placed in this container will be stacked horizontally and vertically centered
 *
 * <strong>Custom element tag</strong>: \<horizontal-container-v\>
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
export class HorizontalContainerV extends BaseContainer {

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
    const justifyContent = this.getAttribute('justifyContent') || 'center';
    
    return `
    .container {
      flex-direction: row;
      flex: 1 0 auto;
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

customElements.define('horizontal-container-v', HorizontalContainerV);