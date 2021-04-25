module.exports = {
	name: 'leave',
	description: 'Leaves the voice channel.',
	aliases: ['fuckoff'],
	guildOnly: true,
	execute(message, args) {
		if (!connections.has(message.guild.id)) return message.channel.send('I wasn\'t even in any voice channel!');
		connections.get(message.guild.id).disconnect();
		connections.delete(message.guild.id);
	}
};

const { connections } = require('../global.js');
