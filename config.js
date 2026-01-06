const os = require("os");

const paths = {
  config: "./",

  registers: "./registers/",
  logs: "./registers/logs/",
  rottenApples: "./registers/rotten_apples/",

  tasks: "./tasks/",
};

const fileNames = {
  config: "config.json",

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
  "_" +
  process.env.PROGRAM_NAME +
  "_" +
  process.env.NODE_ENV +
  "_" +
  process.env.RUN_MODE;

module.exports = { paths, urls, fileNames, processName };
