const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// const { REST } = require("@discordjs/rest");
// const { Routes } = require("discord-api-types/v9");
const { Player } = require('discord-player');

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

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
});


// console log
client.once('ready', () => {
    console.log('BreadBot is online\n');
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
			await command.execute({ client, interaction });
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
			command.execute({ client, commandName, message });
			console.log(`executed ${commandName}`);
		}
		catch (error) {
			console.error(error);
			await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	handleCommand();
});

// keep at end
client.login(token);