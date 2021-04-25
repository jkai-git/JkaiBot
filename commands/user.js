module.exports = {
	name: 'user',
	description: 'Informations about the mentioned users. (you can also use IDs)',
	usage: '(optional)<mentions> (optional)<userIDs>',
	aliases: ['profile'],
	cooldown: 3,
	async execute(message, args) {
		// No args, author info
		if (!args.length) {
			return message.channel.send('>>> ' + infoString(message.author));
		}

		let msg = [];

		if (args[0] === 'all') {
			if (message.guild) {
				msg = (await message.guild.members.fetch()).map(member => {
					return infoString(member.user);
				});
			} else {
				msg.push(infoString(message.author));
				msg.push(infoString(message.client.user));
			}
		} else {
			const parsedArgs = await parseArguments(args, message.client, message.guild);
			if (!parsedArgs) return message.channel.send('Something went wrong. It\'s probably an incorrect id.');
			if (!parsedArgs.filter(arg => arg.type === 'user' || arg.type === 'member').length) {
				return message.channel.send('Wrong argument(s). Use the \`help\` command.');
			}
			parsedArgs.forEach(({ type, data }) => {
				if (type === 'user') msg.push(infoString(data));
				else if (type === 'member') msg.push(infoString(data.user));
			});
		}

		message.channel.send('>>> ' + msg.join('═══════════════════════════\n'), { split: { prepend: '>>> ' } });
	}
};

const { parseArguments } = require('../global.js');

const infoString = user => {
	// Easter Eggs
	if (user.id === '132920751555608576') {
		return `**Name:** ${user.username} (P3tfacepol)\n`
			  +`**Tag:** ${user.tag}\n`
			  +`**id:** +3630720||elhitted||\n`
			  +`**Created at:** ${user.createdAt}\n`
			  +`**Penis size:** Úristen very big\n`;
	}

	// Default Infos
	return `**Name:** ${user.username}\n`
		  +`**Tag:** ${user.tag}\n`
		  +`**id:** ${user.id}\n`
		  +`**Created at:** ${user.createdAt}\n`;
}
