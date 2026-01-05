/**
 * Returns a boolean value that indicates whether or not the given string is an email address
 * @param {string} email
 * @returns
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { isValidEmail };
