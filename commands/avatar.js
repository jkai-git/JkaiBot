module.exports = {
	name: 'avatar',
	description: 'Avatar lookup of mentioned users.',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ dynamic: true, size: 4096 })}`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`;
		});
		message.channel.send(avatarList);
	}
};
