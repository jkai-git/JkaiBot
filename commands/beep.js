module.exports = {
	name: 'beep',
	description: 'BEEP!',
	execute(message, args) {
		message.channel.send('Boop.');
	}
};
