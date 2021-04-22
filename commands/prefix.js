module.exports = {
	name: 'prefix',
	description: 'Shows prefix for server if no argument is given. Changes prefix for server to a given argument. Resets prefix for server if the argument is \`reset\`.',
	usage: '(optional)(<newPrefix>||reset)',
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		if (!args.length) {
			return message.channel.send(`Server prefix: \`${await prefixes.get(message.guild.id) || defaultPrefix}\``);
		}

		if (args[0] === 'reset') {
			await prefixes.delete(message.guild.id);
			return message.channel.send(`Server prefix is reset to: \`${defaultPrefix}\``);
		}

		await prefixes.set(message.guild.id, args[0]);
		message.channel.send(`Server prefix is set to: \`${args[0]}\``);
	}
};

const { dbConnectString } = require('../connect.json');
const { defaultPrefix } = require('../config.json');
const Keyv = require('keyv');

const prefixes = new Keyv(dbConnectString, { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));
