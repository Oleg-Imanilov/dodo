class DodoTemplate {
  constructor(commands) {
    this.commands = commands;
  }

  generate(prompt) {
    const actionsCode = generateActionTypes(this.commands);
    const commandsCode = generateCommands(this.commands);

    return [
      {
        role: "user",
        content: `${prompt}.
Respond strictly with JSON. 
The JSON should be compatible with the TypeScript type Response from the following:
${actionsCode}
${commandsCode}`
      }
    ];
  }
}

function generateActionTypes(commands) {
  const actions = Object.keys(commands).map(key => `${key}Action`);
  return `
    interface Response {
      action: Action;
    };
    
    type Action = ${actions.join(" | ")};
    \n`;
}

function generateCommands(commands) {
  return Object.keys(commands)
    .map(key => {
      const { params = [], description = "" } = commands[key];
      return `
    // ${description}
    type ${key}Action = {
      actionType: '${key}';
      ${params
        .map(param => {
          const { name, type = "string", description = "" } = param;
          return `${name}:${type}; // ${description}`;
        })
        .join("\n")};
    }`;
    })
    .join("\n");
}

module.exports = DodoTemplate;
