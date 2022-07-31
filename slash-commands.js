const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

// for deleting commands
// rest.delete(Routes.applicationCommand(clientId, 'commandId'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);