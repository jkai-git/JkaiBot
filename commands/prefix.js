module.exports = {
	name: 'prefix',
	description: 'Shows prefix for server if no argument is given. Changes prefix for server to a given argument. Resets prefix for server if the argument is \`reset\`.',
	usage: '(optional)(<newPrefix>||reset)',
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		// SHOW
		if (!args.length) {
			return message.channel.send(`My prefix for the server: \`${await prefixes.get(message.guild.id) || defaultPrefix}\``);
		}

		// RESET
		if (args[0] === 'reset') {
			await prefixes.delete(message.guild.id);
			return message.channel.send(`My prefix for the server is RESET to: \`${defaultPrefix}\``);
		}

		// SET
		await prefixes.set(message.guild.id, args[0]);
		message.channel.send(`My prefix for the server is SET to: \`${args[0]}\``);
	}
};

const { prefixes } = require('../global.js');
const { defaultPrefix } = require('../config.json');
