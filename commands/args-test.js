module.exports = {
	name: 'args-test',
	description: 'Argument handling test command.',
	usage: '<arg0> <arg1> ... <argn>',
	aliases: ['args'],
	args: true,
	execute(message, args) {
		message.channel.send(`>>> **Arguments:** ${args.join(' ')}\n`
								+`**Arguments length:** ${args.length}`);
	}
};
