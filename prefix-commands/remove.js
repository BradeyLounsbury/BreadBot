const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove',
    aliases: 'rl',
    description: 'removes song at given place in queue    **Alias:**  *-rl*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message, distube }) => {
        const queue = distube.getQueue(message);
        if (!queue) return message.channel.send('No queue currently :(');

        let rl;
        commandName === 'remove' ? rl = message.content.substring(8) : rl = message.content.substring(4);
        console.log(rl);

        if (commandName === 'rl' || commandName === 'remove-last') {
            queue.songs.pop();
        }
        else {
            const index = parseInt(rl);
            queue.songs.splice(index - 1, 1);
            console.log('removed %d', index);
        }

        // const queueString = queue.songs.shift().map((song, i) => {
        //     return `**${ i + 1 } \`[${song.duration}]\` ${song.name} -- <@${song.user}>**`;
        // }).join('\n');
        let currentSong;
        let currentThumb;
        const queueString = queue.songs.slice(0, queue.songs.length).map((song, i) => {
            if (i === 0) {
                currentSong = (`**\`[${song.formattedDuration}]\`** *${song.name}* -- <${song.user}>`);
                currentThumb = song.thumbnail;
            }
            else {
                return `**${ i + 1 } \`[${song.formattedDuration}]\`** *${song.name}* -- <${song.user}>`;
            }
        }).join('\n');

        const embed = new EmbedBuilder()
            // eslint-disable-next-line no-inline-comments
            .setColor(0x89CFF0) // baby blue
            // eslint-disable-next-line quotes
            .setDescription(`**Now Playing**\n` + currentSong + `\n\n**Up Next**${queueString}`)
            .setThumbnail(currentThumb.thumbnail);
        await message.channel.send('Here\'s the updated queue');
        await message.channel.send({ embeds: [embed] });
    },
};