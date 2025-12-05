/**
 * Results page - Analysis results display
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MetricsGrid from '../components/MetricsGrid';
import Waterfall from '../components/Waterfall';
import WaterfallTable from '../components/WaterfallTable';
import Suggestions from '../components/Suggestions';

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading, error, analyzeUrl } = useAnalysis();

  // Metric toggles
  const [toggles, setToggles] = useState({
    coreWebVitals: true,
    navigationTiming: true,
    resourceSummary: true,
    additionalMetrics: true
  });

  // Waterfall view toggle
  const [waterfallView, setWaterfallView] = useState('chart'); // 'chart' or 'table'

  const url = searchParams.get('url');

  useEffect(() => {
    if (!url) {
      return;
    }
    analyzeUrl(url);
  }, [url]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get color for Core Web Vitals rating
  const getRatingColor = (rating) => {
    const colors = {
      good: '#e8f5e9',
      'needs-improvement': '#fff3e0',
      poor: '#ffebee',
      unknown: '#f5f5f5'
    };
    return colors[rating] || colors.unknown;
  };

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!url) {
    return (
      <div style={{ padding: '48px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorMessage message="No URL provided" />
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '48px 24px' }}>
        <LoadingSpinner message={`Analyzing ${url}...`} />
        <p style={{ textAlign: 'center', color: '#666', marginTop: '16px' }}>
          This may take 10-30 seconds...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '48px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Analyze Another URL
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Prepare metrics for display
  const coreWebVitalsMetrics = [
    {
      label: 'Largest Contentful Paint (LCP)',
      value: data.metrics.coreWebVitals.lcp.value !== null
        ? (data.metrics.coreWebVitals.lcp.value / 1000).toFixed(2)
        : null,
      unit: 's',
      color: getRatingColor(data.metrics.coreWebVitals.lcp.rating)
    },
    {
      label: 'First Input Delay (FID)',
      value: data.metrics.coreWebVitals.fid.value,
      unit: 'ms',
      color: getRatingColor(data.metrics.coreWebVitals.fid.rating)
    },
    {
      label: 'Cumulative Layout Shift (CLS)',
      value: data.metrics.coreWebVitals.cls.value !== null
        ? data.metrics.coreWebVitals.cls.value.toFixed(3)
        : null,
      unit: '',
      color: getRatingColor(data.metrics.coreWebVitals.cls.rating)
    }
  ];

  const navigationTimingMetrics = [
    {
      label: 'Time to First Byte (TTFB)',
      value: data.metrics.navigationTiming.ttfb,
      unit: 'ms'
    },
    {
      label: 'DOM Content Loaded',
      value: (data.metrics.navigationTiming.domContentLoaded / 1000).toFixed(2),
      unit: 's'
    },
    {
      label: 'Full Page Load',
      value: (data.metrics.navigationTiming.loadComplete / 1000).toFixed(2),
      unit: 's'
    },
    {
      label: 'DOM Interactive',
      value: (data.metrics.navigationTiming.domInteractive / 1000).toFixed(2),
      unit: 's'
    }
  ];

  const resourceSummaryMetrics = [
    {
      label: 'Total Requests',
      value: data.metrics.resourceSummary.totalRequests,
      unit: ''
    },
    {
      label: 'Total Page Size',
      value: (data.metrics.resourceSummary.totalSize / (1024 * 1024)).toFixed(2),
      unit: 'MB'
    },
    {
      label: 'JavaScript Size',
      value: (data.metrics.resourceSummary.byType.script.size / 1024).toFixed(2),
      unit: 'KB'
    },
    {
      label: 'CSS Size',
      value: (data.metrics.resourceSummary.byType.stylesheet.size / 1024).toFixed(2),
      unit: 'KB'
    },
    {
      label: 'Image Size',
      value: (data.metrics.resourceSummary.byType.image.size / (1024 * 1024)).toFixed(2),
      unit: 'MB'
    }
  ];

  const additionalMetrics = [
    {
      label: 'First Contentful Paint (FCP)',
      value: data.metrics.additionalMetrics.fcp !== null
        ? (data.metrics.additionalMetrics.fcp / 1000).toFixed(2)
        : null,
      unit: 's'
    },
    {
      label: 'Time to Interactive (TTI)',
      value: (data.metrics.additionalMetrics.tti / 1000).toFixed(2),
      unit: 's'
    },
    {
      label: 'Total Blocking Time (TBT)',
      value: data.metrics.additionalMetrics.tbt,
      unit: 'ms'
    },
    {
      label: 'Speed Index',
      value: (data.metrics.additionalMetrics.speedIndex / 1000).toFixed(2),
      unit: 's'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '24px',
            marginBottom: '8px',
            color: '#333',
            wordBreak: 'break-all'
          }}>
            {data.url}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '16px'
          }}>
            Analyzed at {formatTimestamp(data.timestamp)}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#fff',
                color: '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Home
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Analyze Another URL
            </button>
          </div>
        </div>

        {/* Metric Toggles */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px 24px',
          borderRadius: '8px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#333' }}>
            Toggle Metrics
          </h3>
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {Object.entries(toggles).map(([key, value]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleToggle(key)}
                  style={{ cursor: 'pointer' }}
                />
                <span>
                  {key === 'coreWebVitals' && 'Core Web Vitals'}
                  {key === 'navigationTiming' && 'Navigation Timing'}
                  {key === 'resourceSummary' && 'Resource Summary'}
                  {key === 'additionalMetrics' && 'Additional Metrics'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Core Web Vitals */}
        {toggles.coreWebVitals && (
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
              Core Web Vitals
            </h2>
            <MetricsGrid metrics={coreWebVitalsMetrics} />
          </div>
        )}

        {/* Navigation Timing */}
        {toggles.navigationTiming && (
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
              Navigation Timing
            </h2>
            <MetricsGrid metrics={navigationTimingMetrics} />
          </div>
        )}

        {/* Resource Summary */}
        {toggles.resourceSummary && (
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
              Resource Summary
            </h2>
            <MetricsGrid metrics={resourceSummaryMetrics} />
          </div>
        )}

        {/* Additional Metrics */}
        {toggles.additionalMetrics && (
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
              Additional Metrics
            </h2>
            <MetricsGrid metrics={additionalMetrics} />
          </div>
        )}

        {/* Resource Waterfall */}
        <div style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{ fontSize: '20px', color: '#333' }}>
              Resource Waterfall
            </h2>
            <div style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: '#f5f5f5',
              padding: '4px',
              borderRadius: '6px'
            }}>
              <button
                onClick={() => setWaterfallView('chart')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: waterfallView === 'chart' ? '#1976d2' : 'transparent',
                  color: waterfallView === 'chart' ? '#fff' : '#666',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Chart View
              </button>
              <button
                onClick={() => setWaterfallView('table')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: waterfallView === 'table' ? '#1976d2' : 'transparent',
                  color: waterfallView === 'table' ? '#fff' : '#666',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Table View
              </button>
            </div>
          </div>

          {waterfallView === 'chart' ? (
            <Waterfall resources={data.resources} />
          ) : (
            <WaterfallTable resources={data.resources} />
          )}
        </div>

        {/* Performance Suggestions */}
        <div style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
            Performance Suggestions
          </h2>
          <Suggestions suggestions={data.suggestions} />
        </div>
      </div>
    </div>
  );
}
