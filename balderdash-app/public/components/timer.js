export class Timer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.duration = parseInt(this.getAttribute('duration')) || 10;
    this.remaining = this.duration;
    this.interval = null;
    this.render();
    this.progressBar = this.shadow.querySelector('.progress');
    this.timeDisplay = this.shadow.querySelector('.time-display');
  }

  static get observedAttributes() {
    return ['duration', 'running'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'duration') {
      this.duration = parseInt(newValue) || 10;
      this.reset();
    }

    if (name === 'running') {
      if (this.hasAttribute('running')) {
        this.start();
      } else {
        this.pause();
      }
    }
  }

  connectedCallback() {
    if (this.hasAttribute('running')) {
      this.start();
    }
  }

  disconnectedCallback() {
    this.pause(); 
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 485px;
          margin: 16px 0;
        }

        .container {
          background: #eee;
          border-radius: 8px;
          overflow: hidden;
          height: 24px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
        }

        .progress {
          height: 100%;
          background: linear-gradient(to right, #00c6ff, #0072ff);
          transition: width 0.1s linear;
          width: 100%;
        }

        .time-display {
          text-align: center;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 500;
        }

        ${this.getStyles?.() || ''}
      </style>
      <section class="container">
        <section class="progress" part="progress"></section>
      </section>
      <p class="time-display" part="time">--:--</p>
    `;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  start() {
    this.pause(); // Clear existing timer
    this.remaining = this.remaining || this.duration;
    const startTime = Date.now();
    const endTime = startTime + this.remaining * 1000;

    this.interval = setInterval(() => {
      const now = Date.now();
      this.remaining = Math.max(0, (endTime - now) / 1000);
      const percent = (this.remaining / this.duration) * 100;
      this.progressBar.style.width = `${percent}%`;
      this.timeDisplay.textContent = this.formatTime(this.remaining);

      if (this.remaining <= 0) {
        this.pause();
        this.dispatchEvent(new CustomEvent('timer-end', {
          detail: { message: 'Timer has finished!' },
          bubbles: true,
          composed: true 
        }));
      }
    }, 100);
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
    this.remaining = this.duration;
    this.progressBar.style.width = '100%';
  }
}

customElements.define('progress-timer', Timer);
