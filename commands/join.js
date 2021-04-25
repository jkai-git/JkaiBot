module.exports = {
	name: 'join',
	description: 'Joins the voice channel that you are in.',
	guildOnly: true,
	cooldown: 3,
	execute(message, args) {
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel.');
		if (!message.member.voice.channel.joinable) return message.channel.send('I can\'t join the voice channel that you are in.');
		if (connections.has(message.guild.id)) {
			if (connections.get(message.guild.id).channel.id === message.member.voice.channel.id) {
				return message.channel.send('I\'m already in this channel.');
			} else {
				return message.channel.send('I must leave the other voice channel before I can join yours.');
			}
		}
		return message.member.voice.channel.join()
			.then(connection => {
				connection.voice.setSelfDeaf(true);
				connection.once('disconnect', () => connections.delete(message.guild.id));
				connections.set(message.guild.id, connection);
			})
			.catch(error => {
				console.error('Couldn\'t join voice channel: ', error);
				message.channel.send('There was an error while joining.');
			});
	}
};

const { connections } = require('../global.js');
