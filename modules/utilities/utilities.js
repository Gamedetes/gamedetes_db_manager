/**
 * Returns a boolean value that indicates whether or not the given string is an email address
 * @param {string} email
 * @returns
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 *
 * @returns A string of the current date and time in the format of YYYYMMDDhhmm (Example: 202601101208)
 */
function getShortTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}${hours}${mins}`;
}

/**
 * Checks if there is an environment variable called NODE_ENV with the value "dev"
 * @returns boolean
 */
function isDevelopment() {
  return process.env.NODE_ENV == "dev";
}

module.exports = { isValidEmail, getShortTimestamp, isDevelopment };
