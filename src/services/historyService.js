import { apiRequest } from './api.js';

export async function getScanHistory(signal) {
  return apiRequest('/api/scans/history', { auth: true, signal });
}

export async function getScanHistoryItem(id) {
  return apiRequest(`/api/scans/history/${encodeURIComponent(id)}`, { auth: true });
}

export async function deleteScanHistoryItem(id) {
  return apiRequest(`/api/scans/history/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  });
}
