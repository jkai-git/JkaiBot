module.exports = {
	name: 'play',
	description: 'Plays/Enqueues music. (youtube)',
	usage: '(optional)<url> (optional)<text>',
	aliases: ['enqueue'],
	guildOnly: true,
	args: true,
	cooldown: 3,
	async execute(message, args) {
		if (!connections.has(message.guild.id)) await commands.get('join').execute(message, args);
		if (!connections.has(message.guild.id)) return;
		const connection = connections.get(message.guild.id);
		if (!message.member.voice.channel || connection.channel.id != message.member.voice.channel.id) {
			return message.channel.send(`You must be in my voice channel to use \`${await getPrefix(message.guild)}${this.name}\`.`);
		}

		console.log((await Ytdl.getBasicInfo('https://youtu.be/ZSGdN4hOiLc')).videoDetails);

		//connection.play(await Ytdl(/*url*/, ytdlOptions('2m')), dispatcherOptions);
	}
};

const { connections, commands, getPrefix } = require('../global.js');
const Ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');

const ytdlOptions = seek => {
	return {
		begin: seek,
		quality: 'highestaudio',
		filter: 'audioonly'
	};
}

const dispatcherOptions = {
	type: 'opus',
	bitrate: 'auto',
	highWaterMark: 50,
	volume: false
};
