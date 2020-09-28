const { token } = require('./token.json');
const { prefix } = require('./config.json');

const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	console.log(`${message.author.tag}: ${message.content}`);

	const args = message.content.slice(prefix.length).split(/\s+/);
	const command = args.shift().toLowerCase();

	id (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch(error) {
		console.error(error);
		message.channel.send('There was an error trying to execute this command!');
	}
});

client.login(token);
