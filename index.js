const { prefix, token } = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
	console.log(message.content);

	if (message.content.startsWith(`${prefix}ping`))
		message.channel.send('Pong.');
	else if (message.content.startsWith(`${prefix}beep`))
		message.channel.send('Boop.');
	else if (message.content.startsWith(`${prefix}server`))
		message.channel.send(`Server name: ${message.guild.name}\n`
							+`Server id: ${message.guild.id}\n`
							+`Server owner: ${message.guild.owner}\n`
							+`Total members: ${message.guild.memberCount}\n`
							+`Created at: ${message.guild.createdAt}\n`
							+`Region: ${message.guild.region}`);
	else if (message.content.startsWith(`${prefix}user`))
		message.channel.send(`Nickname: ${message.author.username}\n`
							+`Tag: ${message.author.tag}\n`
							+`id: ${message.author.id}\n`
							+`Created at: ${message.author.createdAt}\n`);
});

client.login(token);
