const fs = require("fs");
const { paths, fileNames } = require("../../config");
const { getShortTimestamp } = require("./utilities");

/**
 * Writes given string value to a log file with time stamp. (Synchronously)
 * Then logs the string in the console.
 * @param {string} input
 * @returns
 */
function log(input) {
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
 * @param {boolean} clear Not required. Default false. If true, this will delete all the logs in the logfile.
 * @returns ALL the logs in the logfile.
 */
function getLogs(clear = false) {
  let logs = fs.readFileSync(paths.logs + fileNames.logs, "utf8");

  if (clear) clearLogFile();

  return logs;
}

/**
 * CLEARS ALL LOGS IN THE LOGFILE
 */
function clearLogFile() {
  fs.writeFileSync(paths.logs + fileNames.logs, "", "utf8");
  console.log("Logfile was cleared.");
}

module.exports = {
  log,
  clearLogFile,
  getLogs,
  getAmountOfLinesInFile,
};
