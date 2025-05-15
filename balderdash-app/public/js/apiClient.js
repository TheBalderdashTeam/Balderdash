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
  options = {
    method: 'GET',
    body: undefined,
    showSpinner: true,
    errorOnFail: true,
    headers: {},
    onRetry: undefined,
  },
) {
  const loadingSpinner = document.querySelector('#loading-spinner');

  if (options.showSpinner) {
      loadingSpinner?.show?.();
  }

  try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          body: JSON.stringify(options.body),
          method: options.method,
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              ...(options.headers),
          },
      });

        if (response.status === 401) {
            logoutUser();
            return;
        }

        if (!response.ok) {
            if (!options.errorOnFail) {
                return;
            }
            const errorData = await response.json().catch(() => ({}));
            showErrorScreen({
                message: errorData.message || 'API request failed',
                onRetry: options.onRetry,
            });
            return;
        }

        return await response.json();
    } catch (error) {
        if (options.errorOnFail) {
            showErrorScreen({
              message: error.message || 'API request failed',
              onRetry: options.onRetry,
            });
        } else return;
    } finally {
        loadingSpinner?.hide?.();
    }
}
