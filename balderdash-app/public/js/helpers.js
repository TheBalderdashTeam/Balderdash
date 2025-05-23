import { ErrorPage } from '../pages/index.js';

export function hexToRgba(color, alpha = 1) {
    // Return as-is if already in rgba format
    if (/^rgba?\(/i.test(color)) {
        return color;
    }

    if (/^#([a-f\d])([a-f\d])([a-f\d])$/i.test(color)) {
        color = color.replace(
            /^#([a-f\d])([a-f\d])([a-f\d])$/i,
            (m, r, g, b) => '#' + r + r + g + g + b + b
        );
    }

    const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (!hexMatch) {
        return color; // fallback: return original
    }

    const r = parseInt(hexMatch[1], 16);
    const g = parseInt(hexMatch[2], 16);
    const b = parseInt(hexMatch[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

let previousContent = null;

export function showErrorScreen({
    message = 'An unexpected error occurred.',
    onRetry = null,
    containerSelector = '#app',
    onDismiss = null,
} = {}) {
    const container = document.querySelector(containerSelector);

    if (!container) return;

    container.innerHTML = '';

    const errorPage = new ErrorPage();
    errorPage.errorMessage = message;

    if (onRetry) errorPage.onRetry = onRetry;

    errorPage.onDismiss = () => {
        if (typeof onDismiss !== 'function') {
            location.href = location.href;
        }
        onDismiss();
    };

    container.appendChild(errorPage);
}

export async function loadHtmlIntoShadow(shadowRoot, htmlFilePath) {
    const response = await fetch(htmlFilePath);
    const htmlString = await response.text();

    while (shadowRoot.firstChild) {
        shadowRoot.removeChild(shadowRoot.firstChild);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    Array.from(doc.body.childNodes).forEach((node) => {
        shadowRoot.appendChild(node);
    });

    Array.from(doc.head.childNodes).forEach((node) => {
        shadowRoot.appendChild(node);
    });
}
