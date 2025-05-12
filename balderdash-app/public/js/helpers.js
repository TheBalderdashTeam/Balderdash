import { ErrorPage } from '../pages/index.js';
import { router } from '../router/index.js';

export function hexToRgba(color, alpha = 1) {
  // Return as-is if already in rgba format
  if (/^rgba?\(/i.test(color)) {
    return color;
  }

  if (/^#([a-f\d])([a-f\d])([a-f\d])$/i.test(color)) {
    color = color.replace(/^#([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b);
  }

  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (!hexMatch) {
    console.warn('Invalid hex color:', color);
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
  containerSelector = '#app'
  
} = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  console.log(container)
  // Save current content so it can be restored
  if (!container.querySelector('error-page')) {
    console.log(true)
    previousContent = container.innerHTML;
  }
  // Clear and insert error screen
  container.innerHTML = '';

  const errorPage = new ErrorPage();
  errorPage.errorMessage = message;

  if (onRetry) errorPage.onRetry = onRetry;

  errorPage.onDismiss = () => {
    router.navigate('/home');
  };

  container.appendChild(errorPage);
}