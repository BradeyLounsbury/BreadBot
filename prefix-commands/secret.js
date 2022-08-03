module.exports = {
    name: 'women',
    aliases: ['woman'],
    description: ' ',
    execute(message, cmd) {
        if (cmd === 'woman') {
            message.channel.send('Dumb broad');
        }
        else {
            message.channel.send('Dumb broads');
        }
    },
};