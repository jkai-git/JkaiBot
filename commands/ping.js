module.exports = {
	name: 'ping',
	description: 'PONG!',
	execute(message, args) {
		message.channel.send('pong');
	}
};
