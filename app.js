const validateEnvironmentVariables = require("./modules/environment_validator/environment_validator");
const logger = require("./modules/utilities/logger");
const facteur = require("./modules/utilities/facteur");
const { processName } = require("./config");
const {
  enableKillSwitch,
  checkKillSwitch,
} = require("./modules/kill_switch/kill_switch");
const { isDevelopment } = require("./modules/utilities/utilities");

// Header for emails
const mailInfoHeader =
  "Process: " +
  processName +
  "\n" +
  "Program: " +
  process.env.PROGRAM_NAME +
  "\n" +
  "Run mode: " +
  process.env.RUN_MODE +
  "\n" +
  "Environment: " +
  process.env.NODE_ENV +
  "\n" +
  "--------------------------------------------------\n";

async function handleCriticalError(err) {
  logger.log(err);
  enableKillSwitch();

  const mailSubject = "Worker Critcal Failure";
  const mailHeader = "!SYSTEM CRITICAL ERROR!";
  let mailDescription = mailInfoHeader;
  mailDescription += "Killswitch enabled.\n";
  mailDescription += "System will NOT continue to operate.\n";
  mailDescription += "Check given error and logs file for more details.\n";
  mailDescription += await facteur.sendErrorReport(
    mailSubject,
    mailHeader,
    mailDescription,
    err
  );
}

async function handleSuccess() {
  const mailSubject =
    "Worker finished [" + processName + "]" + " (successfully)";
  let mailDescription = mailInfoHeader;
  mailDescription += "Successfully finished work.\n";
  mailDescription += "Successfully sent & cleared log file.\n";
  mailDescription += "Can continue to operate as expected.\n";

  await facteur.sendLogsMail(mailSubject, mailDescription, true);
}

async function handleRunMode() {
  switch (process.env.RUN_MODE) {
    case "all":
      logger.log("Running RUN_MODE 'all'");
      break;
    default:
      throw "ERROR. Nothing was executed. This should never be the case. Likely due to a failure in validity checks on the RUN_MODE variable.";
  }
}

async function main() {
  // Environment variables check
  logger.log("System starting");
  const missingVariables = validateEnvironmentVariables();
  if (missingVariables) {
    await handleCriticalError({
      err: "Missing Environment Variables",
      missingVariables,
    });

    return;
  }

  // Main Process
  try {
    await handleRunMode();
    await handleSuccess();
  } catch (err) {
    await handleCriticalError(err);
  }

  if (isDevelopment()) {
    console.log("Finished MAIN function");
  }
}

// Execute logic
if (checkKillSwitch()) {
  console.log("KILL_SWITCH ENABLED");
  return;
}
main().then(() => {
  console.log("Shutting down");
});
