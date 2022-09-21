module.exports = {
    name: 'pause',
    aliases: 'p',
    description: 'pauses current song    **Alias:**  *-p*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const queue = distube.getQueue(message);
        if (!queue) return message.channel.send('No queue currently :(');

        queue.pause();
        message.channel.send('Paused!');
    },
};