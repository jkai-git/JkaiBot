module.exports = {
	name: 'args-test',
	description: 'Argument handling test command.',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send('No arguments were provided.');
		}
		message.channel.send(`Arguments: ${args}\n`
							+`Arguments length: ${args.length}`);
	}
};
