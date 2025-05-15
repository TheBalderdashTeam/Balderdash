import { setItem, getItem } from "../js/storage.js";

export class Timer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.duration = parseInt(this.getAttribute('duration')) || 10;
    this.interval = null;
    this.render();
    this.progressBar = this.shadow.querySelector('.progress');
    this.timeDisplay = this.shadow.querySelector('.time-display');
    
    this.initializeTimerState();
  }

  get storageKey() {
    return `timer_${this.id || 'default'}_state`;
  }

  initializeTimerState() {
    const storedState = this.loadStoredState();
    
    if (storedState && storedState.endTime > Date.now()) {
      this.endTime = storedState.endTime;
      this.duration = storedState.duration;
      this.remaining = (storedState.endTime - Date.now()) / 1000;
      this.updateDisplay();
      
      if (storedState.isRunning) {
        this.start();
      }
    } else {
      this.remaining = this.duration;
      this.endTime = null;
      this.updateDisplay();
      
      if (storedState) {
        this.clearStorage();
      }
    }
  }

  loadStoredState() {
    try {
      const value = getItem(this.storageKey);
      if (!value) return null;
      
      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== 'object') return null;
      
      if (
        typeof parsed.endTime === 'number' && 
        typeof parsed.duration === 'number' &&
        typeof parsed.isRunning === 'boolean'
      ) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.error('Error reading timer storage:', e);
      return null;
    }
  }

  storeCurrentState() {
    const state = {
      endTime: this.endTime,
      duration: this.duration,
      isRunning: this.hasAttribute('running')
    };
    
    if (this.endTime && this.endTime > Date.now()) {
      setItem(this.storageKey, JSON.stringify(state));
    } else {
      this.clearStorage();
    }
  }

  clearStorage() {
    setItem(this.storageKey, '');
  }

  updateDisplay() {
    const percent = (this.remaining / this.duration) * 100;
    this.progressBar.style.width = `${percent}%`;
    this.timeDisplay.textContent = this.formatTime(this.remaining);
  }

  static get observedAttributes() {
    return ['duration', 'running'];
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
    this.pause();
    
    if (!this.endTime || this.remaining <= 0) {
      this.endTime = Date.now() + this.duration * 1000;
    }
    
    this.storeCurrentState();
    
    this.interval = setInterval(() => {
      this.remaining = Math.max(0, (this.endTime - Date.now()) / 1000);
      this.updateDisplay();

      if (this.remaining <= 0) {
        this.handleTimerCompletion();
      } else {
        if (Date.now() % 1000 < 100) {
          this.storeCurrentState();
        }
      }
    }, 100);
  }

  handleTimerCompletion() {
    this.pause();
    this.clearStorage();
    this.dispatchEvent(new CustomEvent('timer-end', {
      bubbles: true,
      composed: true
    }));
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.removeAttribute('running');
      this.storeCurrentState();
    }
  }

  reset() {
    this.pause();
    this.remaining = this.duration;
    this.endTime = null;
    this.clearStorage();
    this.updateDisplay();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'duration') {
      this.duration = parseInt(newValue) || 10;
      if (this.hasAttribute('running')) {
        this.start();
      } else {
        this.reset();
      }
    }

    if (name === 'running') {
      if (this.hasAttribute('running')) {
        this.start();
      } else {
        this.pause();
      }
    }
  }
}

customElements.define('progress-timer', Timer);