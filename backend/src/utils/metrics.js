/**
 * Helper functions for metric calculations
 */

/**
 * Calculate rating for Core Web Vitals
 * @param {string} metric - Metric name (lcp, fid, cls)
 * @param {number} value - Metric value
 * @returns {string} - Rating: "good", "needs-improvement", or "poor"
 */
function calculateRating(metric, value) {
  if (value === null || value === undefined) {
    return 'unknown';
  }

  switch (metric.toLowerCase()) {
    case 'lcp':
      if (value < 2500) return 'good';
      if (value < 4000) return 'needs-improvement';
      return 'poor';

    case 'fid':
      if (value < 100) return 'good';
      if (value < 300) return 'needs-improvement';
      return 'poor';

    case 'cls':
      if (value < 0.1) return 'good';
      if (value < 0.25) return 'needs-improvement';
      return 'poor';

    default:
      return 'unknown';
  }
}

/**
 * Format bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted string (e.g., "1.5 MB", "350 KB")
 */
function formatBytes(bytes) {
  if (bytes === 0 || bytes === null || bytes === undefined) return '0 KB';

  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }

  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
}

module.exports = {
  calculateRating,
  formatBytes
};
