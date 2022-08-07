const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'play',
    description: 'plays video from youtube (still in alpha)',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        if (!message.member.voice.channel) return await message.channel.send('You gotta be inna voice channel');

        const queue = await client.player.createQueue(message.guildId);
        if (!queue.connection) await queue.connect(message.member.voice.channel);

        const url = message.content.substring(6);
        const result = await client.player.search(url, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO,
        });

        if (result.tracks.length === 0) return await message.channel.send('No results found :(');

        const song = result.tracks[0];
        await queue.addTrack(song);

        const embed = new EmbedBuilder()
            .setDescription(`**[${song.title}]** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` });
        await message.channel.send({ embeds: [embed] });

        if (!queue.playing) await queue.play();
    },
};