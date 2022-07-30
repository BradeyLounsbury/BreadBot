const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });

// debug > 0 turns debugging info on
const debug = 0;

// messages that start with this trigger the bot
const prefix = '-';

// const fs = require('fs');

// client.commands = new Client.Collection();

// const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);

//     client.commands.set(command.name, command);
// }

// console log
client.once('ready', () => {
    console.log('BreadBot is online\n');
});

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
    const command = args.shift().toLowerCase();

    // command checks
    if (command === 'ping') {
        // client.commands.get('ping').execute(message, args);
        message.channel.send('pong!');
        console.log('BreadBot pinged, or is it pingged');
    }
});

// keep at end
client.login('MTAwMjM2NDIwMDc3OTI1NTgzOQ.GDll_V.33Eb41Qcy_HHE_l4Js5xqE5EW0llLYxro-9S4o');