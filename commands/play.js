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
	}
};

const { connections, commands } = require('../global.js');
