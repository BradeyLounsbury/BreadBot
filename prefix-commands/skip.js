module.exports = {
    name: 'skip',
    description: 'skips current song',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const queue = distube.getQueue(message);
        if (!queue) return message.channel.send('No queue currently :(');

        if (queue.songs.length === 1) {
            queue.stop();
            return;
        }

        try {
            await queue.skip();
            message.channel.send('Skipped song');
        }
        catch (e) {
            message.channel.send('Sorry I couldn\'t skip for some reason :(');
            console.log(e);
        }
    },
};