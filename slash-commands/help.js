const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('list slash and prefix commands'),
	async execute(interaction) {
		await interaction.reply('Here\'s everything I can do!\n\n\'-\' commands:\n-ping: replies with Pong!\n-play: plays video from youtube (still in alpha)\n-woman or -women: secret\n\nslash commands\n/help: displays commands\n/ping: replies with Pong!');
	},
};