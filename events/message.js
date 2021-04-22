module.exports = {
	name: 'message',
	async execute(message) {
		if (message.author.bot) return;

		let args;
		if (message.guild) {
			const guildPrefix = await prefixes.get(message.guild.id);
			const prefix = guildPrefix ? guildPrefix : Config.defaultPrefix;
			const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(prefix)})\\s*`);

			if (!prefixRegex.test(message.content)) return;

			const [, matchedPrefix] = message.content.match(prefixRegex);
			args = message.content.slice(matchedPrefix.length).trim().split(/\s+/);
		} else {
			const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(Config.defaultPrefix)})\\s*`);

			let sliceLength;
			if (!prefixRegex.test(message.content)) sliceLength = 0;
			else {
				const [, matchedPrefix] = message.content.match(prefixRegex);
				sliceLength = matchedPrefix.length;
			}

			args = message.content.slice(sliceLength).trim().split(/\s+/);
		}

		console.log(`${message.author.tag}: ${message.content}`);

		const commandName = args.shift().toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;

		if (command.guildOnly && message.channel.type === 'dm') {
			return message.channel.send('I can\'t execute that command inside DMs!');
		}

		if (command.args && !args.length) {
			let reply = 'No arguments were provided. :/';

			if (command.usage) {
				reply += `\nProper usage would be: \`${Config.defaultPrefix}${command.name} ${command.usage}\``;
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
				return message.channel.send(`Please wait ${timeLeftString} second(s) before using the \`${command.name}\` command.`);
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

const { dbConnectString } = require('../connect.json');
const Config = require('../config.json');
const Discord = require('discord.js');
const Keyv = require('keyv');

const prefixes = new Keyv(dbConnectString, { namespace: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
