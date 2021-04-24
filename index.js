// Load .env into process.env
require('dotenv').config();

// Initialize Discord Client
const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = { client: client };

// Initialize Commands and Events for the Client
const { commands, cooldowns } = require('./global.js');
const Fs = require('fs');

const commandFiles = Fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.set(command.name, command);

	// Fill cooldowns collection with Commands
	cooldowns.set(command.name, new Discord.Collection());
}

const eventFiles = Fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Bot goes ONLINE
client.login(process.env.BOT_TOKEN);
