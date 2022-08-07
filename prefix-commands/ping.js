module.exports = {
    name: 'ping',
    description: 'this is a ping command',
    // eslint-disable-next-line no-unused-vars
    execute: ({ client, commandName, message }) => {
        message.channel.send('Pong!');
    },
};