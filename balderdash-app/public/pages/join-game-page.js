import { googleButonStyles, pageStyles } from '../js/styles.js';
import { PrimaryButton } from '../components/primary-button.js';
import { SecondaryButton } from '../components/secondary-button.js';
import { VerticalContainerH } from '../components/vertical-container-h.js';
import { HorizontalContainerV } from '../components/horizontal-container-v.js';
import { router } from '../router/index.js';
import { apiFetch } from '../js/apiClient.js';


export class JoinGamePage extends HTMLElement {
  constructor(){
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.pollingInterval = null;     
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: flex;
          box-sizing: border-box;
          flex: 1;
          position: relative;  
        }
        
        .join-game-page ${pageStyles}

        .lobbycode-textbox {
          background-color: black;
          color: white;
          border: 1px solid #ccc;
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 4px;
          width: 100%; /* optional: responsive width */
        }

          
        .joingamebutton {
          position: fixed;
          bottom: clamp(1rem, 5vh, 3rem);
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;   /* Button padding */
          background-color: #4CAF50; /* Green background */
          color: white;         /* White text */
          border: none;         /* Remove default border */
          border-radius: 50px;  /* Rounded corners */
          font-size: 16px;      /* Text size */
          cursor: pointer;      /* Changes cursor on hover */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adds a shadow */
          transition: background-color 0.3s; /* Smooth hover effect */   
        }
          
        /* Hover effect */
        .fixed-button:hover {
          background-color: #45a049; /* Darker green on hover */
        }
        
        .waiting{
          display: block; 
          margin: -7rem auto 0rem; 
          width: 350px;; 
          align-self: center; 
          height: auto; 
          align-items: flex-start;        
        }

        #hangtight{
            font-size: var(--font-large);
            
        }
      </style>

      <section class="join-game-page">

        <base-input 
          label="Enter lobby code"
          minLength="8"
          maxLength="8"></base-input>

        <primary-button id="join-game-button">Join Game</primary-button>
      </section>
    `;
  }
}