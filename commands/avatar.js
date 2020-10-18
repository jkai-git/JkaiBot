module.exports = {
	name: 'avatar',
	description: 'Avatar lookup of mentioned users.',
	aliases: ['pic', 'icon', 'pfp'],
	usage: '(optional)<userTags> (optional)<`@everyone`>',
	execute(message, args) {
		/*
		TO-DO:
			-different behaviour when it's in TEXT and DM channels.
			-therefore refactor.
		*/

		// if @everyone mentioned, send all the avatars on guild
		if (message.mentions.everyone) {
			message.guild.members.fetch().then(memberCollection => {
				const avatarList = memberCollection.map(member => {
					return `${member.displayName}'s avatar: ${member.user.displayAvatarURL(avatarOptions)}`;
				});
				message.channel.send(avatarList);
			});
			return;
		}
		// if no args, send the author's avatar
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL(avatarOptions)}`);
		}
		// send the mentioned users avatar (in guild)
		const avatarList = message.mentions.members.map(member => {
			return `${member.displayName}'s avatar: ${member.user.displayAvatarURL(avatarOptions)}`;
		});
		message.channel.send(avatarList);
	}
};

const avatarOptions = {
	dynamic: true,
	size: 4096
};
