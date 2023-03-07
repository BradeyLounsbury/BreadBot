/* eslint-disable no-inline-comments */
const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

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
const prefix2 = 'alexa';

// distube init
const distube = new DisTube(client, {
	leaveOnEmpty: true,
	leaveOnFinish: false,
	leaveOnStop: false,
	emptyCooldown: 20,
	nsfw: true,
    youtubeCookie: 'SID=TwhsIdOXr6nGIaMdJv1zfKg4sQIZn4g0DYJhDNXg-WWWQP3ckFr03LEGtNDykL2YtHYIHw.; __Secure-1PSID=TwhsIdOXr6nGIaMdJv1zfKg4sQIZn4g0DYJhDNXg-WWWQP3cdRT0LL-hzegdwwJS6GmMLw.; __Secure-3PSID=TwhsIdOXr6nGIaMdJv1zfKg4sQIZn4g0DYJhDNXg-WWWQP3cIeiNdmRZbJN5DWb9XVwn-Q.; HSID=AKQJZKY6OkPzlNCVR; SSID=Aj6bB1oRHs9an0yop; APISID=D8nLz8BZilV4fWIC/A2rYHRebNy6Ca3GWk; SAPISID=1CQqgvtt5RVf-RzV/A_9YW0In2oZFY_hOZ; __Secure-1PAPISID=1CQqgvtt5RVf-RzV/A_9YW0In2oZFY_hOZ; __Secure-3PAPISID=1CQqgvtt5RVf-RzV/A_9YW0In2oZFY_hOZ; YSC=BuqNdmWwdZc; DEVICE_INFO=ChxOekl3TWpReE9UQTNOVE14TXpZMk9EVXhNdz09EP3D0J8GGP3D0J8G; VISITOR_INFO1_LIVE=hRvUHv9vpnc; LOGIN_INFO=AFmmF2swRgIhAMGlcHzGNppwVqq9Lk9R-3a66AkAEzWwwZiquMSF271wAiEA2PFLbup3Ukt75ihjQK04looxu4NzAsXqvH4e3c2uaFU:QUQ3MjNmeUNyWVJkaGVzUklzbTUzaExITFlRX3FVaU43alhnYUlfZnNPR0xuUG4zcF8wOFV5TnU0YjZRU2s5ZWhqZWpscTdHTkw0dmRYV1VGZnR6cHU2RkdtdDlSVExZQ1pMSUVxT3R6blk4UjY1c2RybGdDQm9aNFh6U1gzM3BpLWdkZkZ2OHVLazV5dU0tTm10OVZqSzhRNXZQV3FRdzJB; PREF=f4=4000000&f6=40000000&tz=America.New_York; SIDCC=AFvIBn8HTfWQE72LhN6TBJzZTEvcnpZ7n5LgpzOnfPv5YjpByY8k6MDLuuNrHJP5oOl98evWPg; __Secure-1PSIDCC=AFvIBn_MUvjeP8OlEFsZV3XAH-b1fKn0sNHN--2x0Mei2ieNjqtH8awnMySMNk2pk6zK7l0J_g; __Secure-3PSIDCC=AFvIBn9WapjJ0RmmGSJETndviOL3BrUr28ofIfPk2hE6g9mPxjYCannVD5m9rec1i8K7ZKGbww',
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
		let command, commandName;
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).split(/ +/);
            commandName = args.shift().toLowerCase();
            command = client.prefixCommands.get(commandName) || client.prefixCommands.find(a => a.aliases && a.aliases === commandName);
            console.log(`attempting to execute ${commandName}`);
        }
        else if (message.content.toLocaleLowerCase().startsWith(prefix2)) {
            const args = message.content.slice(prefix2.length + 1).split(/ +/);
            commandName = args.shift().toLowerCase();
            command = client.prefixCommands.get(commandName) || client.prefixCommands.find(a => a.aliases && a.aliases === commandName);
            console.log(`attempting to execute ${commandName}`);
        }

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
client.login(process.env.token);