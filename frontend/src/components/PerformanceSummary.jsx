/**
 * Plain-language performance summary for non-technical users
 */

export default function PerformanceSummary({ data }) {
  // Calculate overall score based on metrics
  const calculateScore = () => {
    let score = 100;
    const { coreWebVitals, navigationTiming, resourceSummary } = data.metrics;

    // LCP scoring
    if (coreWebVitals.lcp.value > 4000) score -= 20;
    else if (coreWebVitals.lcp.value > 2500) score -= 10;

    // Load time scoring
    if (navigationTiming.loadComplete > 5000) score -= 20;
    else if (navigationTiming.loadComplete > 3000) score -= 10;

    // TTFB scoring
    if (navigationTiming.ttfb > 800) score -= 15;
    else if (navigationTiming.ttfb > 600) score -= 10;

    // Resource size scoring
    if (resourceSummary.totalSize > 5000000) score -= 15;
    else if (resourceSummary.totalSize > 3000000) score -= 10;

    // Request count scoring
    if (resourceSummary.totalRequests > 100) score -= 10;
    else if (resourceSummary.totalRequests > 50) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const score = calculateScore();

  // Get performance grade
  const getGrade = () => {
    if (score >= 90) return { letter: 'A', color: '#4caf50', emoji: '🎉', label: 'Excellent' };
    if (score >= 75) return { letter: 'B', color: '#8bc34a', emoji: '👍', label: 'Good' };
    if (score >= 60) return { letter: 'C', color: '#ff9800', emoji: '😐', label: 'Fair' };
    if (score >= 40) return { letter: 'D', color: '#ff5722', emoji: '😕', label: 'Needs Work' };
    return { letter: 'F', color: '#f44336', emoji: '⚠️', label: 'Poor' };
  };

  const grade = getGrade();

  // Generate plain language insights
  const getInsights = () => {
    const insights = [];
    const { coreWebVitals, navigationTiming, resourceSummary } = data.metrics;

    // Load speed
    const loadTimeSeconds = (navigationTiming.loadComplete / 1000).toFixed(1);
    if (navigationTiming.loadComplete < 2000) {
      insights.push({
        type: 'good',
        title: 'Lightning Fast',
        message: `Your site loads in ${loadTimeSeconds} seconds - that's extremely fast! Users won't have to wait.`
      });
    } else if (navigationTiming.loadComplete < 3000) {
      insights.push({
        type: 'good',
        title: 'Fast Loading',
        message: `Your site loads in ${loadTimeSeconds} seconds - that's good! Most users will be satisfied.`
      });
    } else if (navigationTiming.loadComplete < 5000) {
      insights.push({
        type: 'warning',
        title: 'Average Speed',
        message: `Your site loads in ${loadTimeSeconds} seconds - this is okay, but faster would be better.`
      });
    } else {
      insights.push({
        type: 'error',
        title: 'Slow Loading',
        message: `Your site takes ${loadTimeSeconds} seconds to load - users may leave before seeing your content.`
      });
    }

    // Server response
    if (navigationTiming.ttfb < 200) {
      insights.push({
        type: 'good',
        title: 'Quick Server',
        message: 'Your server responds instantly - great hosting!'
      });
    } else if (navigationTiming.ttfb > 600) {
      insights.push({
        type: 'warning',
        title: 'Slow Server Response',
        message: 'Your server takes a while to respond. Consider faster hosting or a CDN.'
      });
    }

    // Page size
    const sizeMB = (resourceSummary.totalSize / (1024 * 1024)).toFixed(2);
    if (resourceSummary.totalSize < 1000000) {
      insights.push({
        type: 'good',
        title: 'Lightweight Page',
        message: `Your page is only ${sizeMB}MB - small and efficient!`
      });
    } else if (resourceSummary.totalSize > 3000000) {
      insights.push({
        type: 'warning',
        title: 'Heavy Page',
        message: `Your page is ${sizeMB}MB - that's quite large. Users on mobile/slow connections may struggle.`
      });
    }

    // JavaScript size
    const jsSizeKB = (resourceSummary.byType.script.size / 1024).toFixed(0);
    if (resourceSummary.byType.script.size > 500000) {
      insights.push({
        type: 'warning',
        title: 'Large JavaScript Files',
        message: `You have ${jsSizeKB}KB of JavaScript code. Breaking it into smaller pieces would help.`
      });
    }

    // Image optimization
    const imageSizeMB = (resourceSummary.byType.image.size / (1024 * 1024)).toFixed(1);
    if (resourceSummary.byType.image.size > 1000000) {
      insights.push({
        type: 'info',
        title: 'Image Optimization',
        message: `You have ${imageSizeMB}MB of images. Compressing them could speed things up.`
      });
    }

    // Number of requests
    if (resourceSummary.totalRequests > 50) {
      insights.push({
        type: 'info',
        title: 'Many Requests',
        message: `Your site makes ${resourceSummary.totalRequests} requests. Combining files could reduce this.`
      });
    }

    return insights;
  };

  const insights = getInsights();

  // Simple recommendations
  const getRecommendations = () => {
    const recs = [];
    const { resourceSummary, navigationTiming } = data.metrics;

    if (resourceSummary.byType.script.size > 500000) {
      recs.push('Split your JavaScript into smaller files that load only when needed');
    }
    if (resourceSummary.byType.image.size > 1000000) {
      recs.push('Compress your images - tools like TinyPNG can reduce size by 70%');
    }
    if (navigationTiming.ttfb > 600) {
      recs.push('Use faster hosting or add a CDN (Content Delivery Network)');
    }
    if (resourceSummary.totalRequests > 50) {
      recs.push('Combine files to reduce the number of requests');
    }
    if (navigationTiming.loadComplete > 3000) {
      recs.push('Enable caching so returning visitors load your site instantly');
    }

    if (recs.length === 0) {
      recs.push('Your site is already well optimized! Keep up the good work.');
    }

    return recs;
  };

  const recommendations = getRecommendations();

  const getInsightStyle = (type) => {
    const styles = {
      good: { bg: '#e8f5e9', border: '#4caf50', icon: '✓' },
      warning: { bg: '#fff3e0', border: '#ff9800', icon: '⚠' },
      error: { bg: '#ffebee', border: '#f44336', icon: '✕' },
      info: { bg: '#e3f2fd', border: '#2196f3', icon: 'ℹ' }
    };
    return styles[type] || styles.info;
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '32px 24px',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Score Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: grade.color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{grade.letter}</div>
          <div style={{ fontSize: '32px' }}>{grade.emoji}</div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', color: '#333' }}>
            Performance Score: {score}/100
          </h2>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
            {grade.label} Performance
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Based on loading speed, server response, and page size
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
          📋 What This Means
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {insights.map((insight, index) => {
            const style = getInsightStyle(insight.type);
            return (
              <div
                key={index}
                style={{
                  backgroundColor: style.bg,
                  border: `2px solid ${style.border}`,
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{style.icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    {insight.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
          💡 How to Improve
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {recommendations.map((rec, index) => (
            <li key={index} style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
