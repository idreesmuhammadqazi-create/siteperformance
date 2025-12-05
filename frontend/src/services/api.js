/**
 * API client for backend communication
 */

/**
 * Analyze URL by calling backend API
 * @param {string} url - URL to analyze
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeUrl(url) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze URL');
    }

    return data;
  } catch (error) {
    // Network errors or fetch failures
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}
