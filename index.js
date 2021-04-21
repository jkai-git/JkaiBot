const { token, dbConnectString } = require('./connect.json');
const Discord = require('discord.js');
const Keyv = require('keyv');
const Fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const keyv = new Keyv(dbConnectString);
keyv.on('error', err => console.error('Keyv connection error:', err));

const commandFiles = Fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
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

client.login(token);
