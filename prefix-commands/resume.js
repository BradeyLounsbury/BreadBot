module.exports = {
    name: 'resume',
    description: 'resumes current song',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        const queue = client.player.getQueue(message.guildId);
        if (!queue || !queue.playing) return await message.channel.send('No song to be resumed dude');

        queue.setPaused(false);
        message.channel.send('Resumed!');
    },
};