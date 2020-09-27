module.exports = {
	name: 'ping',
	description: 'PING!',
	execute(message, args) {
		message.channel.send('Pong.');
	}
};
