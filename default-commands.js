const commands = {
    say: { cmd: 'echo', params: [{ name: 'text', type: 'string' }], description: 'output response from AI to console' },
    find: { cmd: 'find', params: [{ name: 'text', type: 'string' }, { name: '?location', type: 'string' }], description: 'find file in location or from root' },
    branches: { cmd: 'git branch --list', params: [], description: 'list branches of git repository' },
    unknown: { cmd: 'echo', params: [{ name: 'text', type: 'string', description: 'Here is what I know about it: answer' }], description: 'if the user types text that can not easily be translated into known command, just answer in free text' },
}

module.exports = commands