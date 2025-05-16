export const pageStyles = `
  {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5em;
    box-sizing: border-box;
  }
`;

export const googleButonStyles = `
  .gsi-material-button {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-appearance: none;
    background-color: #f2f2f2;
    background-image: none;
    border: none;
    -webkit-border-radius: 0.5em;
    border-radius: 0.5em;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #1f1f1f;
    cursor: pointer;
    font-family: 'Roboto', arial, sans-serif;
    font-size: 0.875rem;
    height: 2.5em;
    letter-spacing: 0.015em;
    outline: none;
    overflow: hidden;
    padding: 0 0.75em;
    position: relative;
    text-align: center;
    -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
    transition: background-color .218s, border-color .218s, box-shadow .218s;
    vertical-align: middle;
    white-space: nowrap;
    width: 100%;
    max-width: 25em;
    min-width: min-content;
  }

  .gsi-material-button .gsi-material-button-icon {
    height: 1.25em;
    margin-right: 0.75em;
    min-width: 1.25em;
    width: 1.25em;
  }

  .gsi-material-button .gsi-material-button-content-wrapper {
    -webkit-align-items: center;
    align-items: center;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
    height: 100%;
    justify-content: center;
    position: relative;
    width: 100%;
  }

  .gsi-material-button .gsi-material-button-contents {
    -webkit-flex-grow: 0;
    flex-grow: 0;
    font-family: 'Roboto', arial, sans-serif;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .gsi-material-button .gsi-material-button-state {
    -webkit-transition: opacity .218s;
    transition: opacity .218s;
    bottom: 0;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .gsi-material-button:disabled {
    cursor: default;
    background-color: #ffffff61;
  }

  .gsi-material-button:disabled .gsi-material-button-state {
    background-color: #1f1f1f1f;
  }

  .gsi-material-button:disabled .gsi-material-button-contents {
    opacity: 38%;
  }

  .gsi-material-button:disabled .gsi-material-button-icon {
    opacity: 38%;
  }

  .gsi-material-button:not(:disabled):active .gsi-material-button-state, 
  .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
    background-color: #001d35;
    opacity: 12%;
  }

  .gsi-material-button:not(:disabled):hover {
    -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
  }

  .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
    background-color: #001d35;
    opacity: 8%;
  }
`;
