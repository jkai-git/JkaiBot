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

		connection.play(await ytdl(/*url*/, ytdlOptions('2m')), dispatcherOptions);
	}
};

const { connections, commands } = require('../global.js');
const ytdl = require('ytdl-core-discord');

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
