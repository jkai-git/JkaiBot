const Discord = require('discord.js');
const Keyv = require('keyv');

// Collections
const commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const connections = new Discord.Collection();

// Keyv Connections
const prefixes = new Keyv(process.env.KEYV_CONNECTSTRING, { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error: ', err));

// Regular Expressions
const regexId = /^\d{18}$/;
const regexMention = /^<@!?(\d{18})>$/;

// Functions
const findCommand = commandName => {
	commandName = commandName.toLowerCase();
	return commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
}
const findUserById = (id, client) => {
	return client.users.fetch(id, false).catch(error => {
		console.error('Not a valid discord id!', error);
	});
}
const findMemberById = (id, guild) => {
	return guild.members.fetch(id).catch(error => {
		console.error('Not a valid guild member id!', error);
	});
}
const parseArguments = async (args, client, guild) => {
	let parsed = [];
	for (let i = 0; i < args.length; ++i) {
		if (regexId.test(args[i])) {
			const user = await findUserById(args[i], client);
			if (!user) return undefined;
			parsed.push({ type: 'user', data: user });
		} else if (regexMention.test(args[i])) {
			const id = args[i].match(regexMention)[1];
			if (guild) {
				const member = await findMemberById(id, guild);
				if (!member) return undefined;
				parsed.push({ type: 'member', data: member });
			} else {
				const user = await findUserById(id, client);
				if (!user) return undefined;
				parsed.push({ type: 'user', data: user });
			}
		} else {
			parsed.push({ type: 'text', data: args[i] });
		}
	}
	return parsed;
}

module.exports = {
	// Collections
	commands, cooldowns, connections,

	// Keyv Connections
	prefixes,

	// Regular Expressions

	// Functions
	findCommand, parseArguments
};
