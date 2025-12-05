/**
 * Custom hook for managing analysis state and API calls
 */

import { useState } from 'react';
import { analyzeUrl as apiAnalyzeUrl } from '../services/api';

export function useAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeUrl = async (url) => {
    // Reset state
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Call API with 60 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout. Please try again.')), 60000);
      });

      const analysisPromise = apiAnalyzeUrl(url);

      const result = await Promise.race([analysisPromise, timeoutPromise]);

      // Success
      setData(result);
      setLoading(false);
    } catch (err) {
      // Error handling
      let errorMessage = 'Failed to analyze URL. Please try again.';

      if (err.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout. The analysis took too long. Please try again.';
      } else if (err.message.includes('Could not reach')) {
        errorMessage = 'Could not load the URL. Please check if the website is accessible.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
      setData(null);
    }
  };

  return {
    data,
    loading,
    error,
    analyzeUrl
  };
}
