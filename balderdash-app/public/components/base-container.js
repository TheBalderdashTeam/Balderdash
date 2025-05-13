export class BaseContainer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.backgroundColour = this.getAttribute('backgroundColour') || '';
    this.margin = this.getAttribute('margin') || '';
    this.borderRadius = this.getAttribute('borderRadius') || '';
    this.padding = this.getAttribute('padding') || '';
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .container {
          display: flex;
          box-shadow: rgba(81, 85, 183, 0.4) 5px 5px, rgba(81, 85, 183, 0.3) 10px 10px, rgba(81, 85, 183, 0.2) 15px 15px, rgba(81, 85, 183, 0.1) 20px 20px, rgba(81, 85, 183, 0.05) 25px 25px;
          position: relative;
          animation: shadowPulse 2s infinite ease-in-out;
        }

        ${this.getStyles()}
      </style>
      <section class="container">
        <slot></slot>
      </section>
    `;
  }
}