module.exports = {
	name: 'avatar',
	description: 'Avatar lookup of mentioned users. (be careful with \`!avatar all\`)',
	usage: '(optional)all (optional)<mentions> (optional)<userIDs>',
	aliases: ['pic', 'icon', 'pfp'],
	async execute(message, args) {
		let avatarList = [];
		// No argument, author avatar
		if (!args.length) {
			avatarList.push({ name: message.author.username, url: message.author.displayAvatarURL(avatarOptions) });
		}
		// All avatar in guild or dm
		else if (args[0] === 'all') {
			// In guild
			if (message.guild) {
				avatarList = (await message.guild.members.fetch()).map(member => {
					return { name: member.displayName, url: member.user.displayAvatarURL(avatarOptions) };
				});
			}
			// In dm
			else {
				avatarList.push({ name: message.author.username, url: message.author.displayAvatarURL(avatarOptions) });
				avatarList.push({ name: message.client.user.username, url: message.client.user.displayAvatarURL(avatarOptions) });
			}
		}
		// Collect mentions' and ids' avatars
		else {
			// By Id
			const ids = args.filter(arg => regexId.test(arg));
			const users = [];
			for (let i = 0; i < ids.length; ++i) {
				let user;
				await message.client.users.fetch(ids[i], false).then(foundUser => {
					user = foundUser;
				}).catch(error => {
					console.error('Not a valid discord id!', error);
					message.channel.send(`No user found for the following id: ${ids[i]}`);
				});
				if (!user) return;
				users.push(user);
			}
			avatarList = avatarList.concat(users.map(user => {
				return { name: user.tag, url: user.displayAvatarURL(avatarOptions) };
			}));
			// In guild mentioned
			if (message.mentions.members && message.mentions.members.size) {
				avatarList = avatarList.concat(message.mentions.members.map(member => {
					return { name: member.displayName, url: member.user.displayAvatarURL(avatarOptions) };
				}));
			}
			// In dm mentioned
			else if (message.mentions.users.size) {
				avatarList = avatarList.concat(message.mentions.users.map(user => {
					return { name: user.username, url: user.displayAvatarURL(avatarOptions) };
				}));
			}
		}

		// Only send image
		if (avatarList.length === 1) return message.channel.send(avatarList[0].url);
		// Send it in blocks of 5 with name
		if (args[0] === 'all') {
			let data = [];
			for (let i = 0; i < avatarList.length; ++i) {
				data.push(`**${avatarList[i].name}:** ${avatarList[i].url}`);
				if ((i + 1) % 5 == 0) {
					message.channel.send(data);
					data = [];
				}
			}
			if (data.length) message.channel.send(data);
			return;
		}
		// Send it with name and slowly (but it's pretty)
		for (let i = 0; i < avatarList.length; ++i) {
			await message.channel.send(`═══════════════════════════\n**${avatarList[i].name}:**`);
			await message.channel.send(avatarList[i].url);
		}
	}
};

const { regexId } = require('../global.js');

const avatarOptions = {
	format: 'png',
	dynamic: true,
	size: 4096
};
