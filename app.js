const validateEnvironmentVariables = require("./modules/environment_validator/environment_validator");
const logger = require("./modules/utilities/logger");
const facteur = require("./modules/utilities/facteur");
const { processName } = require("./config");
const {
  enableKillSwitch,
  checkKillSwitch,
} = require("./modules/kill_switch/kill_switch");

// KILL_SWITCH check
if (checkKillSwitch()) return;

logger.log("System starting");
validateEnvironmentVariables();

switch (process.env.RUN_MODE) {
  case "all":
    logger.log("Testing logging email");
    facteur.sendLogsMail("Log email", "description text", false);
    break;
  default:
    console.log(
      "ERROR. Nothing was executed. This should never be the case. Likely due to a failure in validity checks on the RUN_MODE variable."
    );
    break;
}

// System shut down handling
let mailProgramInfoHeader = "";
mailProgramInfoHeader += "Process: " + processName + "\n";
mailProgramInfoHeader += "Program: " + process.env.PROGRAM_NAME + "\n";
mailProgramInfoHeader += "Run mode: " + process.env.RUN_MODE + "\n";
mailProgramInfoHeader += "Environment: " + process.env.NODE_ENV + "\n";
mailProgramInfoHeader += "--------------------------------------------------\n";

let shutdownHandled = false;
// Make sure all DB connections are closed or this will never trigger
process.on("beforeExit", async () => {
  if (shutdownHandled) return;
  shutdownHandled = true;

  logger.log("Preparing for shutdown");

  try {
    const mailSubject =
      "Worker finished [" + processName + "]" + " (successfully)";
    let mailDescription = mailProgramInfoHeader;
    mailDescription += "Successfully finished work.\n";
    mailDescription += "Successfully sent & cleared log file.\n";
    mailDescription += "Can continue to operate as expected.\n";

    await facteur.sendLogsMail(mailSubject, mailDescription, true);
    console.log("Shutting down");
  } catch (err) {
    logger.log(err);
    enableKillSwitch();

    const mailSubject = "Worker ERROR [" + processName + "]" + " (failure)";
    const mailHeader = "!SYSTEM CRITICAL ERROR!";
    let mailDescription = mailProgramInfoHeader;
    mailDescription += "Failed to send log file.\n";
    mailDescription += "Killswitch enabled.\n";
    mailDescription += "System will NOT continue to operate.\n";
    mailDescription += await facteur.sendErrorReport(
      mailSubject,
      mailHeader,
      mailDescription,
      err
    );
  }
});
