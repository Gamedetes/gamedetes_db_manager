const os = require("os");

const paths = {
  config: "./",
  killSwitch: "./",

  registers: "./registers/",
  logs: "./",
  rottenApples: "./registers/rotten_apples/",

  tasks: "./tasks/",
};

const fileNames = {
  config: "config.js",
  killSwitch: "KILL_SWITCH",

  logs: "logs.txt",
  rottenApples: "rotten_apples.json",

  steamAllApps: "steam.json",
  tasks: "task_",
};

const urls = {
  steamApplist:
    "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json",
  steamAppDetail: "https://store.steampowered.com/api/appdetails?appids=",
  steamApphoverFront: "https://store.steampowered.com/apphoverpublic/", // + APPID + steamApphoverBack
  steamApphoverBack: "?review_score_preference=0&l=english&pagev6=true",
};

const processName =
  os.hostname() +
  "-" +
  process.env.PROGRAM_NAME +
  "-" +
  process.env.NODE_ENV +
  "-" +
  process.env.RUN_MODE;

module.exports = { paths, urls, fileNames, processName };
