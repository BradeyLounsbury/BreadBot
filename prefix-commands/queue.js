const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: 'q',
    description: 'shows songs queued up    **Alias:**  *-q*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const queue = distube.getQueue(message);
        if (!queue) return message.channel.send('No queue currently :(');

        const queueString = queue.songs.slice(0, queue.songs.length).map((song, i) => {
            return `**${ i + 1 } \`[${song.duration}]\` ${song.name} -- <@${song.user}>**`;
        }).join('\n');

        const embed = new EmbedBuilder()
            // eslint-disable-next-line no-inline-comments
            .setColor(0x89CFF0) // baby blue
            // eslint-disable-next-line quotes
            .setDescription(`**Currently Playing**\n` + (queue.song[0] ? `\`[${queue.song[0].duration}]\` ${queue.song[0].name} -- <@${queue.song[0].user}>` : 'None') + `\n\n**Queue**\n${queueString}`)
            .setThumbnail(queue.song[0].thumbnail);
        await message.channel.send({ embeds: [embed] });
    },
};