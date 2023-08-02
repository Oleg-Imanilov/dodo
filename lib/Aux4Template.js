class Aux4Template {
  constructor(config) {
    this.config = config;
  }

  generate(prompt) {
    const config = this.config.get();
    const { profiles } = config;

    const commands = profiles[0].commands
      .filter(command => command.name !== "copilot")
      .map(command => ({
        command: command.name,
        description: command.help.text,
        parameters: command.help.variables.map(variable => ({
          name: variable.name,
          description: variable.text
        }))
      }));

    return [
      {
        role: "user",
        content: `${prompt}.
        Respond strictly with JSON. No explanation needed.
        The JSON format should be {"command": "commandName", "parameters": {"parameterName": "parameterValue"}}.
        Try to find a command that matches the prompt based on the documentation below:
        
        \`\`\`json
        ${JSON.stringify(commands, null, 2)}
        \`\`\`
        
        If you don't find any matches return a JSON format {"text": "I don't know what you mean by that."}.
        
        To add a new command you can call the \`add-command\` command. Where the execute parameter is a string that will be executed in the terminal.
        `
      }
    ];
  }
}

module.exports = Aux4Template;
