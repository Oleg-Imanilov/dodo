#!/usr/bin/env node
const { Configuration, OpenAIApi } = require("openai");
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

const cfg = JSON.parse(fs.readFileSync(`${homedir}/.dodo/.config.json`))
const commands = JSON.parse(fs.readFileSync(`${homedir}/.dodo/commands.json`))
const model = cfg.model // 'gpt-3.5-turbo-16k' // 'gpt-3.5-turbo'

const openai = new OpenAIApi(new Configuration({
  apiKey: cfg.OPENAI_API_KEY,
}));

async function callGpt(prompt) {
  const completion = await openai.createChatCompletion({
    model,
    messages: generatePrompt(prompt)
  });
  return JSON.parse(completion.data.choices[0].message.content)
}

function generatePrompt(prompt) {

  let actions = `interface Response {
  action: Action;
};
type Action = ${Object.keys(commands).map((key) => `${key}Action`).join(' | ')};\n`

  actions += Object.keys(commands).map((key) => {
    const { params = [], description = '' } = commands[key]
    return `
    // ${description}
    type ${key}Action = {
      actionType: '${key}';
      ${params.map((p) => { const { name, type = 'string', description = '' } = p; return `${name}:${type}; // ${description}` }).join('\n')};
    }`
  }).join('\n')

  const messages = [{
    role: "user", content:
      `${prompt}.
Respond strictly with JSON. 
The JSON should be compatible with the TypeScript type Response from the following:
${actions}
`}]
  // console.log('---------------------')
  // console.log(messages)
  // console.log('---------------------')
  return messages
}

async function main() {
  if (process.argv.length >= 3) {
    let args = process.argv.slice(2);
    let prompt = args.join(' ');
    const answer = await callGpt(prompt)
    console.log(answer)
  } else {
    console.log("Usage: dodo <some prompt>")
  }
}

init()
main()










