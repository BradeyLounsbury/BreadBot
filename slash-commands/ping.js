const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with Pong!'),
	execute: async ({ interaction }) => {
		await interaction.editReply({ content: 'Pong!' });
	},
};