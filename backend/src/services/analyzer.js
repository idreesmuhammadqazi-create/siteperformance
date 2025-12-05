/**
 * Puppeteer-based performance analysis service
 */

const puppeteer = require('puppeteer');
const { calculateRating } = require('../utils/metrics');
const { generateSuggestions } = require('./suggestions');

/**
 * Analyze performance of a given URL using Puppeteer
 * @param {string} url - URL to analyze
 * @returns {Object} - Performance analysis results
 */
async function analyzePerformance(url) {
  let browser;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 60000
    });

    // Create new page
    const page = await browser.newPage();

    // Set viewport to desktop size
    await page.setViewport({ width: 1920, height: 1080 });

    // Set realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to URL
    try {
      await page.goto(url, {
        waitUntil: 'load',
        timeout: 30000
      });
    } catch (error) {
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED') ||
          error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        throw new Error('Could not reach the specified URL');
      }
      throw new Error(`Failed to load URL: ${error.message}`);
    }

    // Wait additional time for dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Collect performance data from browser
    const performanceData = await page.evaluate(() => {
      const perfData = window.performance;
      const timing = perfData.timing;
      const navigation = perfData.getEntriesByType('navigation')[0];

      // Navigation Timing metrics
      const ttfb = timing.responseStart - timing.requestStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      const loadComplete = timing.loadEventEnd - timing.navigationStart;
      const domInteractive = timing.domInteractive - timing.navigationStart;

      // Paint Timing
      const paintEntries = perfData.getEntriesByType('paint');
      let fcp = null;
      let lcp = null;

      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          fcp = entry.startTime;
        }
      });

      // Try to get LCP from PerformanceObserver (best effort)
      const lcpEntries = perfData.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        lcp = lcpEntries[lcpEntries.length - 1].startTime;
      }

      // Estimate LCP if not available (use load complete as fallback)
      if (!lcp) {
        lcp = loadComplete;
      }

      // Resource Timing
      const resources = perfData.getEntriesByType('resource').map(resource => {
        // Determine resource type
        let type = resource.initiatorType || 'other';

        // Map types to our categories
        if (type === 'link' && resource.name.includes('.css')) {
          type = 'stylesheet';
        } else if (type === 'script') {
          type = 'script';
        } else if (type === 'img') {
          type = 'image';
        } else if (type === 'css') {
          type = 'stylesheet';
        } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
          type = 'font';
        } else if (type === 'xmlhttprequest' || type === 'fetch') {
          type = 'xhr';
        }

        return {
          name: resource.name,
          type: type,
          startTime: Math.round(resource.startTime),
          duration: Math.round(resource.duration),
          size: resource.transferSize || 0
        };
      }).filter(r => {
        // Filter out data URIs and chrome-extension resources
        return !r.name.startsWith('data:') && !r.name.startsWith('chrome-extension://');
      });

      // CLS - try to get layout shift entries
      let cls = null;
      const layoutShiftEntries = perfData.getEntriesByType('layout-shift');
      if (layoutShiftEntries.length > 0) {
        cls = layoutShiftEntries.reduce((sum, entry) => {
          // Only count shifts without recent user input
          if (!entry.hadRecentInput) {
            return sum + entry.value;
          }
          return sum;
        }, 0);
      }

      // Additional metrics
      const serverResponseTime = timing.responseEnd - timing.requestStart;
      const dnsLookupTime = timing.domainLookupEnd - timing.domainLookupStart;
      const tcpConnectionTime = timing.connectEnd - timing.connectStart;
      const tlsTime = timing.secureConnectionStart > 0
        ? timing.connectEnd - timing.secureConnectionStart
        : 0;

      // Calculate TTI and TBT (simplified estimates)
      const tti = timing.domInteractive - timing.navigationStart;

      // TBT estimation (rough approximation)
      const longTasksEstimate = Math.max(0, domInteractive - fcp - 50);
      const tbt = longTasksEstimate > 0 ? longTasksEstimate : 0;

      // Speed Index (simplified estimation based on FCP and load time)
      const speedIndex = fcp + (loadComplete - fcp) * 0.5;

      return {
        timing: {
          ttfb,
          domContentLoaded,
          loadComplete,
          domInteractive,
          serverResponseTime,
          dnsLookupTime,
          tcpConnectionTime,
          tlsTime
        },
        paint: {
          fcp,
          lcp
        },
        webVitals: {
          cls
        },
        additional: {
          tti,
          tbt,
          speedIndex
        },
        resources
      };
    });

    // Structure the response
    const metrics = {
      coreWebVitals: {
        lcp: {
          value: performanceData.paint.lcp,
          rating: calculateRating('lcp', performanceData.paint.lcp)
        },
        fid: {
          value: null, // FID requires real user interaction
          rating: 'unknown'
        },
        cls: {
          value: performanceData.webVitals.cls,
          rating: performanceData.webVitals.cls !== null
            ? calculateRating('cls', performanceData.webVitals.cls)
            : 'unknown'
        }
      },
      navigationTiming: {
        ttfb: performanceData.timing.ttfb,
        domContentLoaded: performanceData.timing.domContentLoaded,
        loadComplete: performanceData.timing.loadComplete,
        domInteractive: performanceData.timing.domInteractive
      },
      additionalMetrics: {
        fcp: performanceData.paint.fcp,
        tti: performanceData.additional.tti,
        tbt: performanceData.additional.tbt,
        speedIndex: Math.round(performanceData.additional.speedIndex),
        serverResponseTime: performanceData.timing.serverResponseTime,
        dnsLookupTime: performanceData.timing.dnsLookupTime,
        tcpConnectionTime: performanceData.timing.tcpConnectionTime,
        tlsNegotiationTime: performanceData.timing.tlsTime
      },
      resourceSummary: calculateResourceSummary(performanceData.resources)
    };

    // Generate suggestions
    const suggestions = generateSuggestions(metrics, performanceData.resources);

    // Return complete analysis
    return {
      url,
      timestamp: new Date().toISOString(),
      metrics,
      resources: performanceData.resources,
      suggestions
    };

  } catch (error) {
    console.error(`Analysis error for ${url}:`, error.message);
    throw error;
  } finally {
    // Always close browser to prevent memory leaks
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Calculate resource summary statistics
 * @param {Array} resources - Array of resource objects
 * @returns {Object} - Summary statistics
 */
function calculateResourceSummary(resources) {
  const summary = {
    totalRequests: resources.length,
    totalSize: 0,
    byType: {
      script: { count: 0, size: 0 },
      stylesheet: { count: 0, size: 0 },
      image: { count: 0, size: 0 },
      font: { count: 0, size: 0 },
      other: { count: 0, size: 0 }
    }
  };

  resources.forEach(resource => {
    summary.totalSize += resource.size;

    const type = resource.type;
    if (summary.byType[type]) {
      summary.byType[type].count++;
      summary.byType[type].size += resource.size;
    } else {
      summary.byType.other.count++;
      summary.byType.other.size += resource.size;
    }
  });

  return summary;
}

module.exports = {
  analyzePerformance
};
