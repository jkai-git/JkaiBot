module.exports = {
	name: 'message',
	execute(message) {
		const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(Config.prefix)})\\s*`);

		if (!prefixRegex.test(message.content) || message.author.bot) return;
		console.log(`${message.author.tag}: ${message.content}`);

		const [, matchedPrefix] = message.content.match(prefixRegex);
		const args = message.content.slice(matchedPrefix.length).trim().split(/\s+/);
		const commandName = args.shift().toLowerCase();

		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;

		if (command.guildOnly && message.channel.type === 'dm') {
			return message.channel.send('I can\'t execute that command inside DMs!');
		}

		if (command.args && !args.length) {
			let reply = 'No arguments were provided. :/';

			if (command.usage) {
				reply += `\nProper usage would be: \`${Config.prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply, { disableMentions: 'all' });
		}

		if (!message.client.cooldowns.has(command.name)) {
			message.client.cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = message.client.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || Config.defaultCooldown) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeftString = ((expirationTime - now) / 1000).toFixed(1);
				if (timeLeftString === '0.0') return message.channel.send(`Less than 0.1 seconds left before you can use the \`${command.name}\` command.`);
				return message.channel.send(`Please wait ${timeLeftString} more second(s) before using the \`${command.name}\` command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			command.execute(message, args);
		} catch(error) {
			console.error(error);
			message.channel.send('There was an error trying to execute this command!');
		}
	}
};

const { dbConnectString } = require('./connect.json');
const Config = require('../config.json');
const Discord = require('discord.js');
const Keyv = require('keyv');

const prefixes = new Keyv(dbConnectString, { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
