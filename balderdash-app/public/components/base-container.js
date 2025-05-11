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
          position: relative;
        }

        ${this.getStyles()}
      </style>
      <section class="container">
        <slot></slot>
      </section>
    `;
  }
}