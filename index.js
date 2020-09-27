const { prefix } = require('./config.json');
const { token } = require('./token.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	console.log(`${message.author.tag}: ${message.content}`);

	const args = message.content.slice(prefix.length).split(/\s+/);
	const command = args.shift().toLowerCase();

	if (command === 'ping')
		message.channel.send('Pong.');
	else if (command === 'beep')
		message.channel.send('Boop.');
	else if (command === 'server')
		message.channel.send(`Server name: ${message.guild.name}\n`
							+`Server id: ${message.guild.id}\n`
							+`Server owner: ${message.guild.owner.tag}\n`
							+`Total members: ${message.guild.memberCount}\n`
							+`Created at: ${message.guild.createdAt}\n`
							+`Region: ${message.guild.region}`);
	else if (command === 'user')
		message.channel.send(`Nickname: ${message.author.username}\n`
							+`Tag: ${message.author.tag}\n`
							+`id: ${message.author.id}\n`
							+`Created at: ${message.author.createdAt}\n`);
	else if (command === 'args-test') {
		if (!args.length) {
			return message.channel.send('No arguments were provided.');
		}
		message.channel.send(`Arguments: ${args}\n`
							+`Arguments length: ${args.length}`);
	}
	else if (command === 'kick') {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	}
	else if (command === 'avatar') {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ dynamic: true, size: 4096 })}`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`;
		});
		message.channel.send(avatarList);
	}
});

client.login(token);
