/* eslint-disable no-inline-comments */
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    name: 'yt-audio',
    aliases: 'yta',
    description: 'adds "official audio" at the end of the search from youtube *(still in alpha)*    **Alias:**  *-yta*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        if (!message.member.voice.channel) return await message.channel.send('You gotta be inna voice channel');

        let url;
        // remove correct amount for url depending on command name being alias or not
        commandName === 'yt-audio' ? url = message.content.substring(9) + ' official audio' : url = message.content.substring(5) + ' official audio';
        console.log(url);

        const result = await client.player.search(url, {
            requestedBy: message.author,
            searchEngine: QueryType.YOUTUBE_SEARCH,
        });

        if (result.tracks.length === 0) return await message.channel.send('No results found :(');

        let queue = await client.player.getQueue(message.guildId);
        if (!queue || !queue.playing) queue = await client.player.createQueue(message.guildId);
        // console.log('created queue in %d', message.guildId);

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        }
        catch {
            await client.player.deleteQueue(message.guildId);
        }

        const song = result.tracks[0];
        await queue.addTrack(song);

        if (!queue.playing) await queue.play();
        // console.log(queue);

        const embed = new EmbedBuilder()
            .setDescription(`**[${song.title}]** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
            .setColor(0x89CFF0); // baby blue
        await message.channel.send({ embeds: [embed] });

        // console.log(queue);
    },
};