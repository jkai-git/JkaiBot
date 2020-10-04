module.exports = {
	name: 'ping',
	description: 'PING!',
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Pong.');
	}
};
