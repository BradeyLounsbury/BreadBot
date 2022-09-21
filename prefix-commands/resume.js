module.exports = {
    name: 'resume',
    aliases: 'r',
    description: 'resumes current song    **Alias:**  *-r*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const queue = distube.getQueue(message);
        if (!queue) return message.channel.send('No queue currently :(');

        queue.resume();
        message.channel.send('Resumed!');
    },
};