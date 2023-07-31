const fs = require('fs')
const homedir = require('os').homedir();

const DEFAULT_COMMANDS = require('./default-commands') 

function init() {
    if (!fs.existsSync(`${homedir}/.dodo`)) {
        fs.mkdirSync(`${homedir}/.dodo`)
    }

    if (!fs.existsSync(`${homedir}/.dodo/.config.json`)) {
        fs.writeFileSync(`${homedir}/.dodo/.config.json`, '{\n  "OPENAI_API_KEY"="",\n"model":"gpt-3.5-turbo-16k"}')
    }

    if (!fs.existsSync(`${homedir}/.dodo/commands.json`)) {
        fs.writeFileSync(`${homedir}/.dodo/commands.json`, JSON.stringify(DEFAULT_COMMANDS, null, 2))
    }
}

module.exports = init