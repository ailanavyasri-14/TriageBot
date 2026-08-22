// services/api.js
// API & Client Bridge for TriageBot

import { triageArtifact as localTriage } from './threatEngine.js';

export const API_CONFIG = {
  USE_LIVE_BACKEND: false,
  BACKEND_BASE_URL: 'http://localhost:8000',
  SCAN_ENDPOINT: '/api/scan',
  VERSION: '2.0.0-core-app'
};

/**
 * Triages submitted artifacts through backend or local engine
 */
export async function triageArtifactAPI(input, mode = "all") {
  if (API_CONFIG.USE_LIVE_BACKEND) {
    try {
      const res = await fetch(`${API_CONFIG.BACKEND_BASE_URL}${API_CONFIG.SCAN_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifact: input, mode })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Backend error, falling back to local engine:", e);
      return await localTriage(input, mode);
    }
  }
  return await localTriage(input, mode);
}
