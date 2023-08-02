const fs = require("fs");
const os = require("os");

const homedir = os.homedir();
const CONFIG_PATH = `${homedir}/.dodo/.config.json`;

class DodoConfig {
  static load() {
    const configFile = fs.readFileSync(CONFIG_PATH, { encoding: "utf8" });
    return JSON.parse(configFile);
  }
}

module.exports = DodoConfig;
