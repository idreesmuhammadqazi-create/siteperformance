/**
 * API endpoint for performance analysis
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { analyzePerformance } = require('../services/analyzer');
const { isValidUrl } = require('../utils/validators');

const router = express.Router();

/**
 * POST /api/analyze
 * Analyze performance of a given URL
 */
router.post(
  '/',
  [
    body('url')
      .notEmpty()
      .withMessage('URL is required')
      .custom((value) => {
        if (!isValidUrl(value)) {
          throw new Error('Invalid URL format');
        }
        return true;
      })
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }

    const { url } = req.body;

    try {
      // Perform analysis
      const analysisResult = await analyzePerformance(url);

      // Return successful result
      res.status(200).json(analysisResult);

    } catch (error) {
      console.error('Analysis failed:', error.message);

      // Return error response
      res.status(500).json({
        error: `Analysis failed: ${error.message}`
      });
    }
  }
);

module.exports = router;
