const { OpenAIApi, Configuration } = require("openai");
const DodoConfig = require("./DodoConfig");
const Aux4Template = require("./Aux4Template");

class Dodo {
  constructor(config) {
    this.config = config;

    const dodoConfig = DodoConfig.load();
    this.model = dodoConfig.model;
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: dodoConfig.OPENAI_API_KEY
      })
    );
  }

  async complete(prompt) {
    const template = new Aux4Template(this.config);

    const completion = await this.openai.createChatCompletion({
      model: this.model,
      messages: template.generate(prompt)
    });

    return JSON.parse(completion.data.choices[0].message.content);
  }
}

module.exports = Dodo;
