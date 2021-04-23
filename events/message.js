module.exports = {
	name: 'message',
	async execute(message) {
		// Don't spam my bot with other bots
		if (message.author.bot) return;

		// Split message to arguments and prefix test
		// In guild you can use: @mention && (defaultPrefix || guildPrefix)
		// In DM you can use: command without prefix && @mention && defaultPrefix
		let args;
		if (message.guild) args = await guildPrefixTest(message);
		else args = dmPrefixTest(message);
		// no valid prefix found
		if (!args) return;

		// Log the message if it got through prefix test
		console.log(`${message.author.tag}: ${message.content}`);

		// Find command
		const command = findCommand(args.shift());
		if (!command) return;

		// guildOnly test
		if (command.guildOnly && message.channel.type === 'dm') {
			return message.channel.send('I can\'t execute that command inside DMs!');
		}

		// args test
		if (command.args && !args.length) {
			let reply = 'No arguments were provided. :/';

			if (command.usage) {
				reply += `\nProper usage would be: \`${Config.defaultPrefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply, { disableMentions: 'all' });
		}

		// Initialize cooldown variables
		const now = Date.now();
		const timestamps = cooldowns.get(command.name); // cooldowns collection already initialized in index.js, so this must return a collection
		const cooldownAmount = (command.cooldown || Config.defaultCooldown) * 1000;

		// If command is on cooldown for this person
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			const timeLeft = (expirationTime - now) / 1000;

			// DAYS? HOURS?
			// Minutes left
			if (timeLeft > 60) {
				const timeLeftString = (timeLeft / 60).toFixed();
				return message.channel.send(`Please wait ${timeLeftString} minute(s) before using the \`${command.name}\` command.`);
			}

			// Seconds left
			const timeLeftString = timeLeft.toFixed(1);
			if (timeLeftString === '0.0') return message.channel.send(`Less than 0.1 seconds left before you can use the \`${command.name}\` command.`);
			return message.channel.send(`Please wait ${timeLeftString} second(s) before using the \`${command.name}\` command.`);
		}

		// If wasn't on cooldown then set cooldown
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Execute command
		try {
			command.execute(message, args);
		} catch(error) {
			console.error(error);
			message.channel.send('There was an error trying to execute this command!');
		}
	}
};

const { commands, cooldowns, prefixes, findCommand } = require('../global.js');
const Config = require('../config.json');

// To be able to use special characters in Regular Expressions
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

guildPrefixTest = async message => {
	const guildPrefix = await prefixes.get(message.guild.id);
	const prefix = guildPrefix ? guildPrefix : Config.defaultPrefix;
	const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(prefix)})\\s*`);

	if (!prefixRegex.test(message.content)) return undefined;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	return message.content.slice(matchedPrefix.length).trim().split(/\s+/);
}

dmPrefixTest = message => {
	const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(Config.defaultPrefix)})\\s*`);

	let sliceLength;
	if (!prefixRegex.test(message.content)) sliceLength = 0;
	else {
		const [, matchedPrefix] = message.content.match(prefixRegex);
		sliceLength = matchedPrefix.length;
	}

	return message.content.slice(sliceLength).trim().split(/\s+/);
}
