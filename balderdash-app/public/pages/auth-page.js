export class AuthPage extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();

        const loginButton = this.shadow.querySelector('#google-login-button');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.handleGoogleLogin();
            });
        }
    }

    render() {
        const htmlString = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          background: linear-gradient(135deg, #5155B7, #C2AFF7);
          font-family: 'Source Code Pro', monospace;
        }

        section.auth-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: rgb(114, 118, 212);
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          box-shadow: rgba(81, 85, 183, 0.4) 5px 5px, 
                      rgba(81, 85, 183, 0.3) 10px 10px, 
                      rgba(81, 85, 183, 0.2) 15px 15px, 
                      rgba(81, 85, 183, 0.1) 20px 20px, 
                      rgba(81, 85, 183, 0.05) 25px 25px;
          animation: shadowPulse 2s infinite ease-in-out;
        }

        aside.divider {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          width: 100%;
        }

        aside.divider hr {
          flex: 1;
          border: none;
          border-top: 1px solid #E6E6E6;
        }

        aside.divider p {
          margin: 0 8px;
          color: white;
          white-space: nowrap;
        }

        #google-login-button {
          background-color: #ffffff;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Source Code Pro', monospace;
          cursor: pointer;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
          transition: all 0.3s ease;
        }

        #google-login-button:hover {
          background-color: #f2f2f2;
        }

        #google-login-button svg {
          width: 24px;
          height: 24px;
        }

        section.header-text {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .animated-text {
          display: inline-block;
          border-right: solid 3px rgba(240, 46, 170, 0.8);
          white-space: nowrap;
          overflow: hidden;
          font-family: 'Source Code Pro', monospace;
          font-size: clamp(2rem, 8vw, 4rem);
          color: rgba(255, 255, 255, .70);
          animation: animated-text 2s steps(10, end) 1s 1 normal both,
                    animated-cursor 600ms steps(10, end) infinite;
        }

        .sub-heading {
          margin: 0.5rem;
          font-size: 0.8rem;
          font-family: sans-serif;
          font-style: italic;
          color: white;
        }

        @keyframes animated-text {
          from { width: 0; }
          to { width: 10ch; }
        }

        @keyframes animated-cursor {
          from { border-right-color: rgba(0, 102, 204, 0.8); }
          to { border-right-color: transparent; }
        }
      </style>
      
      <section class="auth-container">
        <section class="header-text">
          <p class="animated-text">Dalderbash</p>
          <p class="sub-heading">Committing an act that is adjacent to, but not quite, copyright infringement</p>
        </section>
        <aside class="divider">
          <hr />
          <p>Continue with</p>
          <hr />
        </aside>

        <button id="google-login-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Google
        </button>
      </section>
    `;

        while (this.shadow.firstChild) {
            this.shadow.removeChild(this.shadow.firstChild);
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        Array.from(doc.body.childNodes).forEach((node) => {
            this.shadow.appendChild(node);
        });

        Array.from(doc.head.childNodes).forEach((node) => {
            this.shadow.appendChild(node);
        });
    }

    async handleGoogleLogin() {
        window.location.href = '/auth/google';
    }
}
