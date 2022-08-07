module.exports = {
    name: 'women',
    aliases: ['woman'],
    description: 'secret...',
    // eslint-disable-next-line no-unused-vars
    execute: ({ client, commandName, message }) => {
        if (commandName === 'woman') {
            message.channel.send('Dumb broad');
        }
        else {
            message.channel.send('Dumb broads');
        }
    },
};