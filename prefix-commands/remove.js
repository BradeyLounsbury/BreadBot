const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove',
    aliases: 'rl',
    description: 'removes song at given place in queue *(aliases remove last song)*    **Aliases:**  *-rl* *-remove-last*',
    // eslint-disable-next-line no-unused-vars
    execute: async ({ client, commandName, message }) => {
        console.log(commandName);
        const queue = client.player.getQueue(message.guildId);
        if (!queue || !queue.playing) return await message.channel.send('No song to remove :(');

        const queueLength = queue.tracks.length;
        if (queueLength === 0) return await message.channel.send('No song to remove :(');

        if (commandName === 'rl' || commandName === 'remove-last') {
            queue.tracks.pop();
            console.log('removed %d', queueLength);
        }
        else {
            const index = parseInt(message.content);
            queue.tracks.splice(index);
            console.log('removed %d', index);
        }
        const queueString = queue.tracks.slice(0, queueLength).map((song, i) => {
            return `**${ i + 1 } \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>**`;
        }).join('\n');

        const currentSong = queue.current;

        const embed = new EmbedBuilder()
            // eslint-disable-next-line no-inline-comments
            .setColor(0x89CFF0) // baby blue
            // eslint-disable-next-line quotes
            .setDescription(`**Currently Playing**\n` + (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : 'None') + `\n\n**Queue**\n${queueString}`)
            .setThumbnail(currentSong.setThumbnail);
        await message.channel.send('Here\'s the updated queue');
        await message.channel.send({ embeds: [embed] });
    },
};