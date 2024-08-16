// /* eslint-disable no-inline-comments */
// const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'yt-audio',
    aliases: 'yta',
    description: 'adds "official audio" at the end of the search from youtube *(still in alpha)*    **Alias:**  *-yta*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const voiceChannel = message.member?.voice?.channel;

        let url;
        if (message.content.startsWith('-')) {
            // remove correct amount for url depending on command name being alias or not
            commandName === 'yt-audio' ? url = message.content.substring(9) + ' official audio' : url = message.content.substring(5) + ' official audio';
            console.log('searching for: ' + url);
        }
        else {
            // remove correct amount for url depending on command name being alias or not
            commandName === 'yt-audio' ? url = message.content.substring(14) + ' official audio' : url = message.content.substring(10) + ' official audio';
            console.log('searching for: ' + url);
        }

        if (voiceChannel) {
            distube.play(voiceChannel, url, {
                message,
                textChannel: message.channel,
                member: message.member,
            });
        }
        else {
            message.channel.send({ content: 'You gotta join a voice channel', ephemeral: true });
        }
        // console.log(queue);

        // const embed = new EmbedBuilder()
        //     .setDescription(`**[${song.title}]** has been added to the Queue`)
        //     .setThumbnail(song.thumbnail)
        //     .setFooter({ text: `Duration: ${song.duration}` })
        //     .setColor(0x89CFF0); // baby blue
        // await message.channel.send({ embeds: [embed] });

        // console.log(queue);
    },
};