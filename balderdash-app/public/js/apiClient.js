import { showErrorScreen } from './helpers.js';
import { clearStorage } from './storage.js';

const API_BASE_URL = window.location.origin + '/api';

export async function logoutUser() {
    clearStorage();
    await fetch(window.location.origin + '/logout');
    window.location.href = '/sign-in';
}

export async function apiFetch(
  endpoint,
  options = {},
  body,
  showSpinner = true,
  errorOnFail = true
) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const loadingSpinner = document.querySelector('#loading-spinner');

  if (showSpinner) {
      loadingSpinner?.show?.();
  }

  try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          ...options,
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              ...(options.headers || {}),
          },
          body: body ? JSON.stringify(body) : undefined,
      });

        if (response.status === 401) {
            console.warn('401 Unauthorized — logging out');
            logoutUser();
            return;
        }

        if (!response.ok) {
            if (!errorOnFail) {
                return;
            }
            const errorData = await response.json().catch(() => ({}));
            showErrorScreen({
                message: errorData.message || 'API request failed',
                onRetry: () => apiFetch(endpoint, options),
            });
            return;
        }

        return await response.json();
    } catch (error) {
        if (errorOnFail) {
            showErrorScreen({
                message: error.message || 'API request failed',
                onRetry: () => apiFetch(endpoint, options),
            });
        } else return;
    } finally {
        loadingSpinner?.hide?.();
    }
}
