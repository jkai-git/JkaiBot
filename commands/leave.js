module.exports = {
	name: 'leave',
	description: 'Leaves the voice channel.',
	aliases: ['fuckoff'],
	guildOnly: true,
	execute(message, args) {
		if (!connections.has(message.guild.id)) return message.channel.send('I wasn\'t even in any voice channel!');
		const connection = connections.get(message.guild.id);
		if (!message.member.voice.channel || connection.channel.id != message.member.voice.channel.id) {
			return message.channel.send(`You must be in my voice channel to use \`${this.name}\`.`);
		}
		connection.disconnect();
		connections.delete(message.guild.id);
	}
};

const { connections } = require('../global.js');
