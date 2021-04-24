const { client } = require('./index.js');
const Discord = require('discord.js');
const Keyv = require('keyv');

// Collections
const commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Keyv Connections
const prefixes = new Keyv(process.env.KEYV_CONNECTSTRING, { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error: ', err));

// Regular Expressions
const regexId = /^\d{18}$/;

// Functions
const findCommand = commandName => {
	commandName = commandName.toLowerCase();
	return commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
}
const findUserById = async (id) => {
	return client.users.fetch(id, false).catch(error => {
		console.error('Not a valid discord id!', error);
		return undefined;
	});
}

module.exports = {
	// Collections
	commands, cooldowns,

	// Keyv Connections
	prefixes,

	// Regular Expressions
	regexId,

	// Functions
	findCommand, findUserById
};
