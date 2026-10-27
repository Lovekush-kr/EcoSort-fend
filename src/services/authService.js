/**
 * EcoSort AI — Auth Service
 *
 * Handles user registration, login, and current-user retrieval.
 * Uses the centralized API layer.
 */

import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from './api.js';

/**
 * Register a new user
 *
 * @param {object} credentials
 * @param {string} credentials.name
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<object>} Registration response
 *
 * NOTE: Backend currently returns 503 for registration due to email
 * verification service being unavailable. This is a backend blocker.
 */
export async function register({ name, email, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

/**
 * Login with email and password
 *
 * @param {object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<object>} Login response with token
 *
 * Expected response (verify when endpoint works):
 * { success: true, token: "...", user: { ... } }
 */
export async function login({ email, password }) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  // Store token if present — field name needs verification
  const token = data.token || data.accessToken;
  if (token) {
    setAuthToken(token);
  }

  return data;
}

/**
 * Get the current authenticated user
 *
 * @returns {Promise<object>} User profile data
 */
export async function getCurrentUser() {
  return apiRequest('/api/auth/me', { auth: true });
}

/**
 * Logout — remove stored token
 */
export function logout() {
  removeAuthToken();
}

/**
 * Check if user has a stored token (does not verify validity)
 */
export function hasToken() {
  return !!getAuthToken();
}

