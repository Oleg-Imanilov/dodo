After reading [this](https://microsoft.github.io/TypeChat/docs/introduction/). (Sorry guys, didn't use your package)

I started my little project

## How to use it

1. create alias to dodo.js execution (or make it executable and add to path)
```
alias dodo='node /full-path/dodo.js'
```

2. Execute `dodo` without parameters (one time) - it will create new folder with some files
    * `~/.dodo/.config.json` - You should put openAi API key here
    * `~/.dodo/defaultCommands.json` - defaultCommands that dodo understands

3. Use it anywhere
```
dodo tell me about London
dodo search for taxes in documents
```