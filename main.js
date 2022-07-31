const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const slashCommandsPath = path.join(__dirname, 'slash-commands');
const prefixCommandsPath = path.join(__dirname, 'prefix-commands');

const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));

// map collection of slash commands
for (const file of slashCommandFiles) {
	const filePath = path.join(slashCommandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.slashCommands.set(command.data.name, command);
}
// map collection of prefix commands
for (const file of prefixCommandFiles) {
	const filePath = path.join(prefixCommandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.prefixCommands.set(command.name, command);
}

// debug > 0 turns debugging info on
const debug = 0;

// messages that start with this trigger the bot
const prefix = '-';


// console log
client.once('ready', () => {
    console.log('BreadBot is online\n');
});

// slash commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
    catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// prefix commands
client.on('messageCreate', message => {
    if (debug) {
        console.log('msg read');
    }

    // ignore if message doesn't start with prefix or is from itself
    if (!message.content.startsWith(prefix) || message.author.bot) {
        if (debug) {
            console.log(message);
        }
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(commandName);

    if (!command) return;

	try {
		command.execute(message);
	}
    catch (error) {
		console.error(error);
		message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// keep at end
client.login(token);