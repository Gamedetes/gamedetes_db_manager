const { paths, fileNames } = require("../../config");
const fs = require("fs");
const logger = require("../utilities/logger");

const killSwitchPath = paths.killSwitch + fileNames.killSwitch;

/**
 * Creates an empty KILL_SWITCH file in the designated folder
 */
function enableKillSwitch() {
  fs.writeFileSync(killSwitchPath, "");
  logger.log("Kill switch enabled");
}

/**
 * Deletes the killswitch flag
 * @returns True if successful
 */
function disableKillSwitch() {
  try {
    fs.unlinkSync(killSwitchPath);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 *
 * @returns Creates a killswitch flag
 */
function checkKillSwitch() {
  return fs.existsSync(paths.killSwitch + fileNames.killSwitch);
}

module.exports = { enableKillSwitch, disableKillSwitch, checkKillSwitch };
