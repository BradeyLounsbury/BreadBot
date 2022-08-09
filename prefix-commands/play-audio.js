/* eslint-disable no-inline-comments */
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'play audio',
    aliases: 'yta',
    description: 'adds "official audio" at the end of the search from youtube *(still in alpha)*    **Alias:**  *-yta*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        if (!message.member.voice.channel) return await message.channel.send('You gotta be inna voice channel');

        const queue = await client.player.createQueue(message.guildId);
        if (!queue.connection) await queue.connect(message.member.voice.channel);

        let url;
        // remove correct amount for url depending on command name being alias or not
        commandName === 'yt audio' ? url = message.content.substring(9) + ' official audio' : url = message.content.substring(4) + ' official audio';
        console.log(url);

        const result = await client.player.search(url, {
            requestedBy: message.author,
            searchEngine: QueryType.YOUTUBE_SEARCH,
        });

        if (result.tracks.length === 0) return await message.channel.send('No results found :(');

        const song = result.tracks[0];
        await queue.addTrack(song);

        const embed = new EmbedBuilder()
            .setDescription(`**[${song.title}]** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
            .setColor(0x89CFF0); // baby blue
        await message.channel.send({ embeds: [embed] });

        if (!queue.playing) await queue.play();
    },
};