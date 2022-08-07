module.exports = {
    name: 'skip',
    description: 'skips current song',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        const queue = client.player.getQueue(message.guildId);
        if (!queue || !queue.playing) return await message.channel.send('No song to be skipped dude');

        const currentSong = queue.current;
        const skipped = queue.skip();
        await message.channel.send(skipped ? `Skipped **${currentSong}**` : 'Couldn\'t skip current song for some reason :(');
    },
};