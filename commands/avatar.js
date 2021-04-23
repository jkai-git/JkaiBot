module.exports = {
	name: 'avatar',
	description: 'Avatar lookup of mentioned users. (be careful with \`!avatar all\`)',
	usage: '(optional)(<userTags>||all)',
	aliases: ['pic', 'icon', 'pfp'],
	async execute(message, args) {
		/*
		TO-DO:
			-different behaviour when it's in TEXT and DM channels.
			-therefore refactor.
		*/

		// if @everyone mentioned, send all the avatars on guild
		if (args[0] === 'all') {
			const memberCollection = await message.guild.members.fetch();
			const avatarList = memberCollection.map(member => {
				return `${member.user.displayAvatarURL(avatarOptions)}`;
			});
			let data = [];
			for (let i = 0; i < avatarList.length; i++) {
				data.push(avatarList[i]);
				if ((i+1) % 10 === 0) {
					message.channel.send({ files: data });
					data = [];
				}
			}
			message.channel.send({ files: data });
			return;
		}
		// if no args, send the author's avatar
		if (!message.mentions.users.size) {
			return message.channel.send({ files: [message.author.displayAvatarURL(avatarOptions)] });
		}
		// send the mentioned users avatar (in guild)
		const avatarList = message.mentions.members.map(member => {
			return `${member.user.displayAvatarURL(avatarOptions)}`;
		});
		message.channel.send(avatarList);
	}
};

const avatarOptions = {
	dynamic: true,
	size: 4096
};
