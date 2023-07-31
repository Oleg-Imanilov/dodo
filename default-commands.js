const commands = {
    say: {
        description: 'output response from AI to console',
        cmd: 'echo',
        params: [{
            name: 'text',
            type: 'string'
        }]
    },
    find: {
        description: 'find file in location or from root',
        cmd: 'find',
        params: [{
            name: 'text',
            type: 'string'
        },
        {
            name: '?location',
            type: 'string'
        }]
    },
    branches: {
        description: 'list branches of git repository',
        cmd: 'git branch --list',
        params: []
    },
    unknown: {
        description: 'if the user types text that can not easily be translated into known command, just answer in free text',
        cmd: 'echo',
        params: [{
            name: 'text',
            type: 'string',
            description: 'Here is what I know about it: answer'
        }]
    },
}

module.exports = commands