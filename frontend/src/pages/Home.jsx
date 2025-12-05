/**
 * Home page - URL input form
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    // Navigate to results page with URL as query param
    navigate(`/results?url=${encodeURIComponent(url)}`);
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    setError(null); // Clear error when user types
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        padding: '48px 32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          marginBottom: '8px',
          textAlign: 'center',
          color: '#1976d2'
        }}>
          Site Performance Analyzer
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Analyze any website's performance in seconds
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1976d2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />

          {/* Error message */}
          {error && (
            <div style={{ marginBottom: '16px' }}>
              <ErrorMessage message={error} />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!url.trim()}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: url.trim() ? '#1976d2' : '#ccc',
              border: 'none',
              borderRadius: '8px',
              cursor: url.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (url.trim()) e.target.style.backgroundColor = '#1565c0';
            }}
            onMouseLeave={(e) => {
              if (url.trim()) e.target.style.backgroundColor = '#1976d2';
            }}
          >
            Analyze Performance
          </button>
        </form>

        {/* Feature list */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '18px',
            marginBottom: '16px',
            color: '#333'
          }}>
            What you'll get:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              'Core Web Vitals (LCP, FID, CLS)',
              'Detailed load timing metrics',
              'Resource waterfall visualization',
              'Actionable performance suggestions'
            ].map((feature, index) => (
              <li
                key={index}
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ color: '#4caf50' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
