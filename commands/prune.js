module.exports = {
	name: 'prune',
	description: 'Delete [1..99] amount of messages not older than 2 weeks in the channel.',
	usage: '<number[1..99]>',
	guildOnly: true,
	args: true,
	execute(message, args) {
		/*
		TO-DO:
			-research on permissions 'cause this command only works with additional permissions.
		*/

		// Test the argument
		const amount = parseInt(args[0]) + 1;
		if (isNaN(amount)) {
			return message.channel.send('That doesn\'t seem to be a valid number.');
		} else if (amount < 2 || amount > 100) {
			return message.channel.send('The number has to be [1..99]');
		}

		// Delete messages
		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('There was an error trying to prune messages in this channel.');
		});
	}
};
