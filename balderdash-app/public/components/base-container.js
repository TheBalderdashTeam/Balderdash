export class BaseContainer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
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