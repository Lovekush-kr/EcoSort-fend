/**
 * EcoSort AI — Centralized API Layer
 *
 * All backend communication goes through this module.
 * UI components should use the service modules (classificationService, authService)
 * which in turn use this base layer.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecosort-ai-u1ln.onrender.com';

/**
 * Custom API error with status code and parsed response
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Get the stored auth token
 */
export function getAuthToken() {
  return localStorage.getItem('ecosort_token');
}

/**
 * Set the auth token
 */
export function setAuthToken(token) {
  localStorage.setItem('ecosort_token', token);
}

/**
 * Remove the auth token
 */
export function removeAuthToken() {
  localStorage.removeItem('ecosort_token');
}

/**
 * Make an API request with consistent error handling
 *
 * @param {string} endpoint - API endpoint (e.g., '/api/health')
 * @param {object} options - Fetch options
 * @param {object} options.headers - Additional headers
 * @param {string} options.method - HTTP method
 * @param {object|FormData} options.body - Request body
 * @param {boolean} options.auth - Whether to include auth token
 * @param {AbortSignal} options.signal - AbortController signal
 * @returns {Promise<object>} Parsed JSON response
 */
export async function apiRequest(endpoint, options = {}) {
  const { auth = false, signal, ...fetchOptions } = options;

  const headers = { ...fetchOptions.headers };

  // Add auth header if requested
  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add JSON content-type for non-FormData bodies
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    if (typeof fetchOptions.body === 'object') {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0
    );
  }

  // Try to parse JSON response
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      throw new ApiError('Invalid response from server.', response.status);
    }
  } else {
    // Non-JSON response
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

export { API_BASE_URL };

