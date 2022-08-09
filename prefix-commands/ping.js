module.exports = {
    name: 'ping',
    description: 'replies with Pong!',
    // eslint-disable-next-line no-unused-vars
    execute: ({ client, commandName, message }) => {
        message.channel.send('Pong!');
    },
};