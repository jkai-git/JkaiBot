module.exports = {
	name: 'join',
	description: 'Joins the voice channel that you are in.',
	guildOnly: true,
	cooldown: 3,
	delete: true,
	async execute(message, args) {
		if (Player.isJoined(message.guild.id)) return Player.reAlignPlayer();
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel.');
		if (!message.member.voice.channel.joinable) return message.channel.send('I can\'t join the voice channel that you are in.');

		if (await Player.join(message.member.voice.channel)) Player.buildPlayer(message.channel);
		else message.channel.send('Couldn\'t join for some reason.');
	}
};

const Player = require('../musicplayer.js');
const Discord = require('discord.js');
