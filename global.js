const Discord = require('discord.js');
const Keyv = require('keyv');

// Collections
const commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Keyv Connections
const prefixes = new Keyv(process.env.KEYV_CONNECTSTRING, { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error: ', err));

// Functions
findCommand = commandName => {
	commandName = commandName.toLowerCase();
	return commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
}

module.exports = {
	// Collections
	commands, cooldowns,

	// Keyv Connections
	prefixes,

	// Functions
	findCommand
};
