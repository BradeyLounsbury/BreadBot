/* eslint-disable no-inline-comments */
const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { EmbedBuilder } = require('discord.js');

// const { REST } = require("@discordjs/rest");
// const { Routes } = require("discord-api-types/v9");
const { DisTube } = require('distube');
// const { SoundCloudPlugin } = require('@distube/soundcloud');
// const { SpotifyPlugin } = require('@distube/spotify');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates,
] });

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const slashCommandFiles = fs.readdirSync('./slash-commands').filter(file => file.endsWith('.js'));
const prefixCommandFiles = fs.readdirSync('./prefix-commands').filter(file => file.endsWith('.js'));

// map collection of slash commands
for (const file of slashCommandFiles) {
	const command = require(`./slash-commands/${file}`);
	client.slashCommands.set(command.data.name, command);
}
// map collection of prefix commands
for (const file of prefixCommandFiles) {
	const command = require(`./prefix-commands/${file}`);
	client.prefixCommands.set(command.name, command);
}

// debug > 0 turns debugging info on
// const debug = 0;

// messages that start with this trigger the bot
const prefix = '-';

// distube init
const distube = new DisTube(client, {
	leaveOnEmpty: true,
	leaveOnFinish: false,
	leaveOnStop: true,
	emptyCooldown: 20,
	nsfw: true,
});

// console log
client.once('ready', () => {
    console.log('BreadBot is online now using Distube\n');
});

// slash command handling
client.on('interactionCreate', interaction => {
	async function handleCommand() {
		if (!interaction.isChatInputCommand()) return;

		console.log(`attempting to execute ${interaction.commandName}`);
		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

		try {
			await interaction.deferReply({ ephemeral: true });
			await command.execute({ client, interaction, distube, status });
			console.log(`executed ${interaction.commandName}`);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command :(', ephemeral: true });
		}
	}
	handleCommand();
});

// prefix commands
client.on('messageCreate', message => {
    async function handleCommand() {
		// ignore if message doesn't start with prefix or is from itself
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(a => a.aliases && a.aliases === commandName);
		console.log(`attempting to execute ${commandName}`);

		if (!command) return;

		try {
			command.execute({ client, commandName, message, distube });
			console.log(`executed ${commandName}`);
		}
		catch (error) {
			console.error(error);
			await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	handleCommand();
});

// distube settings
const status = queue =>
	`Volume: \`${queue.volume}%\` | Filter: \`${
		queue.filters.names.join(', ') || 'Off'
	}\` | Loop: \`${
		queue.repeatMode
			? queue.repeatMode === 2
				? 'All Queue'
				: 'This Song'
			: 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

distube
    .on('playSong', (queue, song) => {
        // queue.textChannel?.send(
        //     `Playing \`${song.name}\` - \`${
        //         song.formattedDuration
        //     }\`\nRequested by: ${song.user}`,
        // ),
        const embed = new EmbedBuilder()
            .setDescription(`**[${song.name}]** is now playing\nRequested by: ${song.user}`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.formattedDuration}` })
            .setColor(0x89CFF0); // baby blue
        queue.textChannel.send({ embeds: [embed] });
    })
    .on('addSong', (queue, song) => {
        if (queue.songs.length > 1) {
            // queue.textChannel?.send(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`);
            const embed = new EmbedBuilder()
                .setDescription(`**[${song.name}]** has been added to the Queue\nRequested by: ${song.user}`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.formattedDuration}` })
                .setColor(0x89CFF0); // baby blue
            queue.textChannel.send({ embeds: [embed] });
        }
    })
    .on('addList', (queue, playlist) =>
        queue.textChannel?.send(
            `Added \`${playlist.name}\` playlist (${
                playlist.songs.length
            } songs) to queue`,
        ),
    )
    .on('error', (textChannel, e) => {
        console.error(e);
        textChannel.send(
            `An error encountered: ${e.message.slice(0, 2000)}`,
        );
    })
    .on('empty', queue =>
        queue.textChannel?.send(
            'Well this is awkward...',
        ),
    )
    // DisTubeOptions.searchSongs > 1
    .on('searchResult', (message, result) => {
        let i = 0;
        message.channel.send(
            `**Choose an option from below**\n${result
                .map(
                    song =>
                    `**${++i}**. ${song.name} - \`${
                            song.formattedDuration
                        }\``,
                )
                .join(
                    '\n',
            )}\n*Enter anything else or wait 30 seconds to cancel*`,
        );
    })
    .on('searchCancel', message =>
        message.channel.send('Searching canceled'),
    )
    .on('searchInvalidAnswer', message =>
        message.channel.send('Invalid number of result.'),
    )
    .on('searchNoResult', message =>
        message.channel.send('No result found!'),
    );

// keep at end
client.login(token);