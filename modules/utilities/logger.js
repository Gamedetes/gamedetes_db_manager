const fs = require("fs");
const { paths, fileNames } = require("../../config");

function log(input) {
  // Temporary
  console.log(input);
  return;

  if (typeof input != "string") return;

  let logOutput = "[" + new Date().toUTCString() + "]: " + input;

  fs.appendFileSync(paths.logs + fileNames.logs, logOutput + "\n", (err) => {
    if (err) {
      console.log(err);
    }
  });

  console.log(logOutput);
}

/**
 * Counts the amount of lines that are present in the logger file, then sends the amount.
 * @returns Amount of lines in the logs file. -1 if something went wrong.
 */
function getAmountOfLinesInFile() {
  try {
    const logs = getLogs();
    const lines = logs.split("\n");
    return lines.length;
  } catch (err) {
    return -1;
  }
}

/**
 *
 * @param {boolean} reset Not required. Default false. If true, this will delete all the logs in the logfile.
 * @returns ALL the logs in the logfile.
 */
function getLogs(reset = false) {
  let logs = fs.readFileSync(paths.logs + fileNames.logs, "utf8");

  if (reset) resetLogFile();

  return logs;
}

/**
 * CLEARS ALL LOGS IN THE LOGFILE
 */
function resetLogFile() {
  fs.writeFileSync(paths.logs + fileNames.logs, "", "utf8");
  console.log("Logfile was reset.");
}

module.exports = {
  log,
  resetLogFile,
  getLogs,
  getAmountOfLinesInFile,
};
