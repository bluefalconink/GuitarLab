/**
 * GuitarLab — API utility functions.
 * Central place for all backend communication with error handling and logging.
 */

const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling and logging.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.detail || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`[API] Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`[API] Success: ${url}`, data);
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('[API] Network error — is the backend running?');
      throw new Error('Cannot connect to the server. Please make sure the backend is running.');
    }
    throw error;
  }
}

/**
 * Send a chat message to the backend.
 */
export async function sendChatMessage({ message, agent = 'luthier', sessionId = null, imageUrl = null }) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      agent,
      session_id: sessionId,
      image_url: imageUrl,
    }),
  });
}

/**
 * Upload an image file for guitar hardware analysis.
 */
export async function uploadImage(file) {
  const url = `${API_BASE}/upload`;
  console.log(`[API] POST ${url} | file=${file.name} size=${file.size}`);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type — browser sets it with boundary for multipart
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.detail || `Upload failed: HTTP ${response.status}`;
      console.error(`[API] Upload error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`[API] Upload success:`, data);
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to the server. Please make sure the backend is running.');
    }
    throw error;
  }
}

/**
 * Advance the Luthier setup step.
 */
export async function advanceStep(sessionId) {
  return apiFetch(`/chat/advance-step?session_id=${sessionId}`, {
    method: 'POST',
  });
}

/**
 * Health check.
 */
export async function healthCheck() {
  return apiFetch('/health');
}
