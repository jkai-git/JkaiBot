module.exports = {
	name: 'args-test',
	description: 'Argument handling test command.',
	args: true,
	usage: '<arg0> <arg1> ... <argn>',
	execute(message, args) {
		message.channel.send(`Arguments: ${args}\n`
							+`Arguments length: ${args.length}`);
	}
};
