module.exports = {
	name: 'play',
	description: 'Plays/Enqueues music. (youtube)',
	usage: '(optional)<url> (optional)<text>',
	aliases: ['enqueue'],
	guildOnly: true,
	args: true,
	cooldown: 3,
	delete: true,
	async execute(message, args) {
		if (!Player.isJoined(message.guild.id)) {
			if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel.');
			if (!message.member.voice.channel.joinable) return message.channel.send('I can\'t join the voice channel that you are in.');

			if (await Player.join(message.member.voice.channel)) {
				await Player.addToQueue(args, message, message.channel);
				Player.buildPlayer(message.channel);
				return;
			}
			else return message.channel.send('Couldn\'t join for some reason.');
		}

		const connection = Player.connections.get(message.guild.id);
		if (!message.member.voice.channel || connection.channel.id != message.member.voice.channel.id) {
			return message.channel.send(`You must be in my voice channel to use \`${await getPrefix(message.guild)}${this.name}\`.`);
		}

		await Player.addToQueue(args, message, message.channel);
	}
};

const { getPrefix } = require('../global.js');
const Player = require('../musicplayer.js');
