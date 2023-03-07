// const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'play',
    aliases: 'yt',
    description: 'plays audio from youtube video *(still in alpha)*    **Alias:**  *-yt*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const voiceChannel = message.member?.voice?.channel;

        let url;
        if (message.content.startsWith('-')) {
            commandName === 'play' ? url = message.content.substring(6) : url = message.content.substring(4);
            console.log('searching for: ' + url);
        }
        else {
            commandName === 'play' ? url = message.content.substring(11) : url = message.content.substring(9);
            console.log('searching for: ' + url);
        }

        const results = distube.search(url);
        const r = await results;
        url = r[0].url;
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