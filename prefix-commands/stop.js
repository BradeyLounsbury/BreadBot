module.exports = {
    name: 'stop',
    description: 'stops current queue',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const queue = distube.getQueue(message);
        if (!queue) return message.channel.send('No queue currently :(');

        try {
            await queue.stop();
            message.channel.send('Stopped playing shit');
        }
        catch (e) {
            message.channel.send('Sorry I couldn\'t stop playing for some reason :(');
            console.log(e);
        }
    },
};