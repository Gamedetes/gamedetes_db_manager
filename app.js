const validateEnvironmentVariables = require("./modules/environment_validator");

validateEnvironmentVariables();
console.log("Current time: ", new Date().toISOString());

switch (process.env.RUN_MODE) {
  case "all":
    break;
  default:
    console.log(
      "ERROR. Nothing was executed. This should never be the case. Likely due to a failure in validity checks on the RUN_MODE variable."
    );
    break;
}
