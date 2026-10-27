/**
 * EcoSort AI — Classification Service
 *
 * Handles waste image classification and category fetching.
 * Uses the centralized API layer.
 */

import { apiRequest } from './api.js';

/**
 * Check backend health status
 * @returns {Promise<object>} Health status response
 */
export async function checkHealth() {
  return apiRequest('/api/health');
}

/**
 * Get supported waste categories from backend
 * @returns {Promise<string[]>} Array of category names
 */
export async function getCategories() {
  const data = await apiRequest('/api/categories');
  return data.categories || [];
}

/**
 * Classify a waste image
 *
 * @param {File} imageFile - The image file to classify
 * @param {AbortSignal} [signal] - Optional abort signal for cancellation
 * @returns {Promise<object>} Classification result from backend
 *
 * Response shape (verified against backend — update if changed):
 * The exact fields are mapped in the ClassificationResult component.
 * At minimum, we expect the backend to return the classification data.
 */
export async function classifyImage(imageFile, signal) {
  const formData = new FormData();
  formData.append('image', imageFile);

  return apiRequest('/api/classify', {
    method: 'POST',
    body: formData,
    auth: true,
    signal,
  });
}

/**
 * Fallback categories used when backend is unreachable.
 * Clearly separated from live data.
 */
export const FALLBACK_CATEGORIES = [
  { name: 'plastic', label: 'Plastic', icon: '♻️' },
  { name: 'paper', label: 'Paper', icon: '📄' },
  { name: 'glass', label: 'Glass', icon: '🪟' },
  { name: 'metal', label: 'Metal', icon: '🔩' },
  { name: 'organic', label: 'Organic', icon: '🌿' },
  { name: 'e-waste', label: 'E-Waste', icon: '🔌' },
];

