/*
Checks if all the environment variables are present and have correct values.
If all the variables are present and correct, returns null.
If there are any variables incorrect or missing, returns an array of strings with each incorrect or missing variable's name.
*/
function validateEnvironmentVariables() {
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

  // Return statement
  if (missingVariables.length > 0) {
    return missingVariables;
  } else return null;
}
