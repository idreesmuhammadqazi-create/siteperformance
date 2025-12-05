/**
 * URL validation helper
 */

/**
 * Validates if a string is a valid URL with http/https protocol
 * @param {string} url - URL string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

module.exports = {
  isValidUrl
};
