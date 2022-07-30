const { Client, GatewayIntentBits } = require('discord.js');

const client = new Discord.Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
]});

//messages that start with this trigger bot
const prefix = '-';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//console log
client.once('ready', () => {
    console.log('BreadBot is online\n');
})

client.on('message', message => {
    //ignore if message doesn't start with prefix or is from itself
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //command checks
    if(command === 'ping') {
        client.commands.get('ping').execute(message, args);
        console.log('BreadBot pinged, or is it pingged');
    }
});

//keep at end
client.login("MTAwMjM2NDIwMDc3OTI1NTgzOQ.GDll_V.33Eb41Qcy_HHE_l4Js5xqE5EW0llLYxro-9S4o");