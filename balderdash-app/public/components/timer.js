import { setItem, getItem } from '../js/storage.js';
import { loadHtmlIntoShadow } from '../js/helpers.js';

export class Timer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.duration = parseInt(this.getAttribute('duration')) || 10;
        this.interval = null;
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
            isRunning: this.hasAttribute('running'),
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

    async connectedCallback() {
        await this.render();
        this.progressBar = this.shadow.querySelector('.progress');
        this.timeDisplay = this.shadow.querySelector('.time-display');
        this.initializeTimerState();
        if (this.hasAttribute('running')) {
            this.start();
        }
    }

    disconnectedCallback() {
        this.pause();
    }

    async render() {
        await loadHtmlIntoShadow(this.shadow, '../html/timer.html');
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0');
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
        this.dispatchEvent(
            new CustomEvent('timer-end', {
                bubbles: true,
                composed: true,
            })
        );
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
