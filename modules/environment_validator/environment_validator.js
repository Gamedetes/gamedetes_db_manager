const utilities = require("../utilities/utilities");

/**
 * Checks if all the environment variables are present and have correct values.
 * If there are any variables incorrect or missing these will be logged and returned as an array.
 * @returns Null if all variables are correct and present. Otherwise an array of missing variables.
 */
function validateEnvironmentVariables() {
  if (utilities.isDevelopment())
    console.log("Validating environment variables");

  // Setup
  var missingVariables = [];

  // NODE_ENV
  switch (process.env.NODE_ENV) {
    case "dev":
    case "prod":
      break;
    default:
      missingVariables.push("NODE_ENV");
  }

  // RUN_MODE
  switch (process.env.RUN_MODE) {
    case "all":
      break;
    default:
      missingVariables.push("RUN_MODE");
  }

  // PROGRAM_NAME
  if (!process.env.PROGRAM_NAME) missingVariables.push("PROGRAM_NAME");

  // MAIL_FROM
  if (!utilities.isValidEmail(process.env.MAIL_FROM))
    missingVariables.push("MAIL_FROM");

  // MAIL_FROM_SECRET
  if (!process.env.MAIL_FROM_SECRET) missingVariables.push("MAIL_FROM_SECRET");

  // MAIL_TO
  if (!utilities.isValidEmail(process.env.MAIL_TO))
    missingVariables.push("MAIL_TO");

  // Return statement
  if (missingVariables.length > 0) {
    return missingVariables;
  } else return null;
}

module.exports = validateEnvironmentVariables;
