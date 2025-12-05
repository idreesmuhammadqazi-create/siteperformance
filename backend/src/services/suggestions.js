/**
 * Generate performance suggestions based on metrics
 */

const { formatBytes } = require('../utils/metrics');

/**
 * Generate performance suggestions based on collected metrics
 * @param {Object} metrics - Performance metrics object
 * @param {Array} resources - Array of resource objects
 * @returns {Array} - Array of suggestion objects
 */
function generateSuggestions(metrics, resources) {
  const suggestions = [];

  // Large JavaScript warning
  if (metrics.resourceSummary?.byType?.script?.size > 500000) {
    const sizeMB = (metrics.resourceSummary.byType.script.size / (1024 * 1024)).toFixed(2);
    suggestions.push({
      type: 'warning',
      category: 'JavaScript',
      message: `Large JavaScript files detected (${sizeMB} MB). Consider code splitting and lazy loading.`
    });
  }

  // Many requests warning
  if (metrics.resourceSummary?.totalRequests > 50) {
    suggestions.push({
      type: 'warning',
      category: 'Network',
      message: `High number of requests (${metrics.resourceSummary.totalRequests}). Consider bundling resources or using HTTP/2.`
    });
  }

  // Slow TTFB warning
  if (metrics.navigationTiming?.ttfb > 600) {
    suggestions.push({
      type: 'warning',
      category: 'Server',
      message: `Slow server response time (${metrics.navigationTiming.ttfb} ms). Optimize server-side processing or consider a CDN.`
    });
  }

  // Large images warning
  if (metrics.resourceSummary?.byType?.image?.size > 1000000) {
    const sizeMB = (metrics.resourceSummary.byType.image.size / (1024 * 1024)).toFixed(2);
    suggestions.push({
      type: 'warning',
      category: 'Images',
      message: `Large image files detected (${sizeMB} MB). Use image optimization and modern formats like WebP.`
    });
  }

  // Poor LCP error
  if (metrics.coreWebVitals?.lcp?.value > 2500) {
    const lcpSeconds = (metrics.coreWebVitals.lcp.value / 1000).toFixed(2);
    suggestions.push({
      type: 'error',
      category: 'Core Web Vitals',
      message: `Largest Contentful Paint is slow (${lcpSeconds} s). Optimize loading of largest visible element.`
    });
  }

  // Poor CLS error
  if (metrics.coreWebVitals?.cls?.value > 0.1) {
    suggestions.push({
      type: 'error',
      category: 'Core Web Vitals',
      message: `Cumulative Layout Shift is high (${metrics.coreWebVitals.cls.value.toFixed(3)}). Reserve space for images and ads to prevent layout shifts.`
    });
  }

  // Many CSS files info
  if (metrics.resourceSummary?.byType?.stylesheet?.count > 5) {
    suggestions.push({
      type: 'info',
      category: 'CSS',
      message: `Multiple CSS files (${metrics.resourceSummary.byType.stylesheet.count}). Consider combining stylesheets.`
    });
  }

  // Good overall performance
  if (suggestions.length === 0 && metrics.navigationTiming?.loadComplete < 3000) {
    suggestions.push({
      type: 'success',
      category: 'Overall',
      message: 'Great performance! Your site loads quickly.'
    });
  }

  return suggestions;
}

module.exports = {
  generateSuggestions
};
