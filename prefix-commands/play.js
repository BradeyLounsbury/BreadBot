// const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'play',
    aliases: 'yt',
    description: 'plays audio from youtube video *(still in alpha)*    **Alias:**  *-yt*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const voiceChannel = message.member?.voice?.channel;

        let url;
        commandName === 'play' ? url = message.content.substring(6) : url = message.content.substring(4);
        console.log(url);

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
    },
};