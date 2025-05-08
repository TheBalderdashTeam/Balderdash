import { BaseContainer } from "./base-container.js";

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
 */
export class VerticalContainerH extends BaseContainer {

  getStyles() {

    const backgroundColour = this.getAttribute('backgroundColour') || '';
    const margin = this.getAttribute('margin') || '';
    const borderRadius = this.getAttribute('borderRadius') || '';
    const padding = this.getAttribute('padding') || '';

    return `
    .container {
      flex: 1 0 auto;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      ${backgroundColour ? `background-color: rgba(${backgroundColour}, 0.7);` : ''}
      ${margin ? `margin: ${margin};` : ''}
      ${padding ? `padding: ${padding};` : ''}
      ${borderRadius ? `border-radius: ${borderRadius};` : ''}
    }
  `;
  }  
}

customElements.define('vertical-container-h', VerticalContainerH);