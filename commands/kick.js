module.exports = {
	name: 'kick',
	description: 'Kick the mentioned user.',
	guildOnly: true,
	args: true,
	usage: '<userTag>',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		const mentionedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${mentionedUser.username}`);
	}
};
