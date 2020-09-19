const { prefix, token } = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(message.content);

	if (message.content.startsWith(`${prefix}ping`))
		message.channel.send('Pong.');
	else if (message.content.startsWith(`${prefix}beep`))
		message.channel.send('Boop.');
});

client.login(token);
