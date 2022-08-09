const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('list all commands and their functionalities'),
	execute: async ({ client, interaction }) => {
		let helpString = 'Here\'s everything I can do!\n\n';

		// prefix commands
		helpString += '**\'-\' Commands:**\n';
		for (const cmd of client.prefixCommands) {
			helpString += '**-';
			helpString += cmd[1].name;
			helpString += ':** ';
			helpString += cmd[1].description;
			helpString += '\n';
		}

		// slash commands
		helpString += ('\n**Slash Commands:**\n');
		for (const cmd of client.slashCommands) {
			helpString += '**/';
			helpString += cmd[1].data.name;
			helpString += ':** ';
			helpString += cmd[1].data.description;
			helpString += '\n';
		}

		await interaction.editReply({ content: helpString, ephemeral: true });
	},
};