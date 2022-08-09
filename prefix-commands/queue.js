const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: 'q',
    description: 'shows songs queued up    **Alias:** *-q*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        const queue = client.player.getQueue(message.guildId);
        if (!queue || !queue.playing) return await message.channel.send('No songs queued');

        let queueLength = 10;
        if (queue.tracks.length < queueLength) queueLength = queue.tracks.length;

        const queueString = queue.tracks.slice(0, queueLength).map((song, i) => {
            return `**${ i + 1 } \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`;
        }).join('\n');

        console.log(queueString);

        const currentSong = queue.current;

        const embed = new EmbedBuilder()
            // eslint-disable-next-line no-inline-comments
            .setColor(0x89CFF0) // baby blue
            // eslint-disable-next-line quotes
            .setDescription(`**Currently Playing**\n` + (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : 'None') + `\n\n**Queue**\n${queueString}`)
            .setThumbnail(currentSong.setThumbnail);
        await message.channel.send({ embeds: [embed] });
    },
};