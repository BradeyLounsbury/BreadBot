module.exports = {
    name: 'women',
    aliases: ['woman'],
    description: ' ',
    execute(cmd, message) {
        if (cmd === 'woman') {
            message.channel.send('Dumb broad');
        }
        else {
            message.channel.send('Dumb broads');
        }
    },
};