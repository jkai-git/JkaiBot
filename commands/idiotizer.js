module.exports = {
	name: 'idiotizer',
	description: 'iDiOtOzItRoN mEgAx100',
	usage: '<text>',
	args: true,
	execute(message, args) {
		let text = args.join(' ').toLowerCase().split('');
		for (let i = 0; i < text.length; ++i) {
			if (i % 2 == 1) {
				text[i] = text[i].toUpperCase();
			}
		}
		text = text.join('');

		message.channel.send(text);
	}
};
