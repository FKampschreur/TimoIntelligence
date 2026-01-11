/**
 * Agent logging utility
 * Handles logging to external service with proper error handling
 * Silently fails if service is not available (no console errors)
 */

// Track if service is available (starts as unknown, becomes false after first failure)
let serviceAvailable: boolean | null = null;

/**
 * Log to agent service with error handling
 * Silently fails if service is not available (no console errors)
 */
export const agentLog = (location: string, message: string, data?: any): void => {
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
  // In production, skip agent logging entirely
  if (!isDev) {
    return;
  }

  // If we know the service is unavailable, skip immediately
  if (serviceAvailable === false) {
    return;
  }

  // Attempt to log (non-blocking, silent failure)
  fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data: { ...data, timestamp: Date.now() },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A'
    }),
    signal: AbortSignal.timeout(200), // 200ms timeout - fail fast
  })
    .then((response) => {
      // If successful, mark service as available
      if (response.ok) {
        serviceAvailable = true;
      } else {
        // If not ok, mark as unavailable
        serviceAvailable = false;
      }
    })
    .catch(() => {
      // Silently fail - mark service as unavailable for future calls
      // This prevents repeated failed attempts
      serviceAvailable = false;
    });
};
