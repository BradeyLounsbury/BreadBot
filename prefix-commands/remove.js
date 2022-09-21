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
            const index = parseInt(message.content);
            queue.songs.splice(index);
            console.log('removed %d', index);
        }

        const queueString = queue.songs.shift().map((song, i) => {
            return `**${ i + 1 } \`[${song.duration}]\` ${song.name} -- <@${song.user}>**`;
        }).join('\n');

        const embed = new EmbedBuilder()
            // eslint-disable-next-line no-inline-comments
            .setColor(0x89CFF0) // baby blue
            // eslint-disable-next-line quotes
            .setDescription(`**Currently Playing**\n` + (queue.song[0] ? `\`[${queue.song[0].duration}]\` ${queue.song[0].title} -- <@${queue.song[0].requestedBy.id}>` : 'None') + `\n\n**Queue**\n${queueString}`)
            .setThumbnail(queue.song[0].thumbnail);
        await message.channel.send('Here\'s the updated queue');
        await message.channel.send({ embeds: [embed] });
    },
};