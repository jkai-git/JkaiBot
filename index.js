const { token } = require('./token.json');
const config = require('./config.json');

const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	console.log(`${message.author.tag}: ${message.content}`);

	const args = message.content.slice(config.prefix.length).split(/\s+/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.channel.send('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = 'No arguments were provided. :/';

		if (command.usage) {
			reply += `\nProper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply, { disableMentions: 'all' });
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || config.defaultCooldown) * 1000;

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
});

client.login(token);
