const API_BASE_URL = window.location.origin + '/api'; 

export async function logoutUser() {
  await fetch(window.location.origin+'/logout');
  window.location.href = '/sign-in';
}

export async function apiFetch(endpoint, options = {}) {

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (response.status === 401) {
      console.warn('401 Unauthorized — logging out');
      logoutUser();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('apiFetch error:', error);
    throw error;
  }
}
