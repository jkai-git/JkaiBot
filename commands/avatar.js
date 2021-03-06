module.exports = {
	name: 'avatar',
	description: `Avatar lookup of mentioned users. (be careful with \`all\`)`,
	usage: '(optional)all (optional)<mentions> (optional)<userIDs>',
	aliases: ['pic', 'icon', 'pfp'],
	cooldown: 3,
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
			const parsedArgs = await parseArguments(args, message.client, message.guild);
			if (!parsedArgs) return message.channel.send('Something went wrong. It\'s probably an incorrect id.');
			if (!parsedArgs.filter(arg => arg.type === 'user' || arg.type === 'member').length) {
				return message.channel.send(`Wrong argument(s). Use the \`${await getPrefix(message.guild)}help\` command.`);
			}
			parsedArgs.forEach(({type, data}) => {
				if (type === 'user') avatarList.push({ name: data.tag, url: data.displayAvatarURL(avatarOptions)});
				else if (type === 'member') avatarList.push({ name: data.displayName, url: data.user.displayAvatarURL(avatarOptions)});
			});
		}

		// Only send image
		if (avatarList.length === 1) return message.channel.send(avatarList[0].url);
		// Send it in blocks of 5 with name
		if (args[0] === 'all') {
			let data = [];
			for (let i = 0; i < avatarList.length; ++i) {
				data.push(`**${avatarList[i].name}:** ${avatarList[i].url}`);
				if ((i + 1) % 5 == 0) {
					await message.channel.send(data);
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

const { parseArguments, getPrefix } = require('../global.js');

const avatarOptions = {
	format: 'png',
	dynamic: true,
	size: 4096
};
