module.exports = {
    name: 'pause',
    aliases: 'p',
    description: 'pauses current song    **Alias:**  *-p*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        const queue = client.player.getQueue(message.guildId);
        if (!queue || !queue.playing) return await message.channel.send('No song to be paused dude');

        queue.setPaused(true);
        message.channel.send('Paused!');
    },
};