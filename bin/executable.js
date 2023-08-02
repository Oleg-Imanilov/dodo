const os = require("os");
const {
  Engine,
  Config,
  CommandLineExecutor,
  Interpreter,
  ParameterInterpreter,
  CommandParameters,
  DefaultParameterRetriever,
  ExecutorChain
} = require("@aux4/engine");
const init = require("../lib/init");
const Dodo = require("../lib/Dodo");
const fs = require("fs");

const args = process.argv.slice(2);
const homedir = os.homedir();
const COMMANDS_PATH = `${homedir}/.dodo/commands.json`;

(async () => {
  init();

  const config = new Config();
  const dodo = new Dodo(config);

  const aux4 = {
    profiles: [
      {
        name: "main",
        commands: [
          {
            name: "copilot",
            execute: async (params, action) => {
              const prompt = [...action].join(" ");
              const answer = await dodo.complete(prompt);

              if (answer.text) {
                console.log(answer.text);
                return;
              }

              const commandParameters = Object.entries(answer.parameters || {})
                .map(([key, value]) => [`--${key}`, value])
                .flatMap(item => item);

              const commandLineArgs = [answer.command, ...commandParameters];

              const engine = createAux4Engine(config);
              await engine.run(commandLineArgs);
            },
            help: {
              text: "AI Copilot to help you execute commands"
            }
          },
          {
            name: "add-command",
            execute: async cmd => {
              const params = cmd.params;

              const commandName = await params.name;
              const description = await params.description;
              const paramsString = await params.params;
              const execute = await params.execute;

              const commandParams = (paramsString || "")
                .split(",")
                .map(param => param.split(":"))
                .filter(([name]) => name !== "")
                .map(([name, description]) => ({ name, text: description }));

              const command = {
                name: commandName,
                execute: [execute],
                help: {
                  text: description,
                  variables: commandParams
                }
              };

              const aux4 = config.get();
              const commands = [
                ...aux4.profiles[0].commands.filter(
                  command => command.name !== "copilot" && command.name !== "add-command"
                )
              ];
              commands.push(command);

              const newAux4 = { ...aux4 };
              newAux4.profiles[0].commands = commands;

              fs.writeFileSync(`${homedir}/.dodo/commands.json`, JSON.stringify(newAux4, null, 2));
            },
            help: {
              text: "add a new command to the list of commands",
              variables: [
                {
                  name: "name",
                  text: "name of command"
                },
                {
                  name: "description",
                  text: "description of what the command does"
                },
                {
                  name: "params",
                  text: "optional. parameters of the command comma separated, using colon to separate name and description of the parameter. e.g.: path:the path to the file, name:the name of the file"
                },
                {
                  name: "execute",
                  text: `the command to execute. to use the parameters : e.g.: ls \${path}`
                }
              ]
            }
          }
        ]
      }
    ]
  };

  config.load(aux4);
  config.loadFile(COMMANDS_PATH);

  const engine = createAux4Engine(config);
  await engine.run(args);
})();

function createAux4Engine(config) {
  const interpreter = new Interpreter();
  interpreter.add(new ParameterInterpreter());

  const commandParametersFactory = CommandParameters.newInstance();
  commandParametersFactory.register(new DefaultParameterRetriever());

  const executorChain = new ExecutorChain(interpreter, commandParametersFactory);
  executorChain.register(CommandLineExecutor);

  return new Engine({ config, interpreter, executorChain });
}
