const fs = require("fs");
const homedir = require("os").homedir();
const template = require("../resources/template.json");

const DEFAULT_CONFIG = {
  OPENAI_API_KEY: "",
  model: "gpt-3.5-turbo-16k"
};

function init() {
  if (!fs.existsSync(`${homedir}/.dodo`)) {
    fs.mkdirSync(`${homedir}/.dodo`);
  }

  if (!fs.existsSync(`${homedir}/.dodo/.config.json`)) {
    fs.writeFileSync(`${homedir}/.dodo/.config.json`, JSON.stringify(DEFAULT_CONFIG, null, 2));
  }

  if (!fs.existsSync(`${homedir}/.dodo/commands.json`)) {
    fs.writeFileSync(`${homedir}/.dodo/commands.json`, JSON.stringify(template, null, 2));
  }
}

module.exports = init;
