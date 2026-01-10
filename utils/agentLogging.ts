/**
 * Agent logging utility
 * Handles logging to external service with proper error handling
 */

/**
 * Log to agent service with error handling
 * In development mode, logs errors to console if fetch fails
 */
export const agentLog = (location: string, message: string, data?: any): void => {
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
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
    })
  }).catch((error) => {
    // In dev mode, log errors to console for debugging
    if (isDev) {
      console.warn('Agent logging failed:', error);
    }
    // In production, silently fail (intentional)
  });
};
