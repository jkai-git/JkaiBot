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

		let data = [];

		if (args[0] === 'all') {
			if (message.guild) {
				data = (await message.guild.members.fetch()).map(member => {
					return infoString(member.user);
				});
			} else {
				data.push(infoString(message.author));
				data.push(infoString(message.client.user));
			}
		} else {
			const parsedArgs = await parseArguments(args, message.client, message.guild);
			if (!parsedArgs) return message.channel.send('Something went wrong. It\'s probably an incorrect id.');
			if (!parsedArgs.filter(arg => arg.type === 'user' || arg.type === 'member').length) {
				return message.channel.send('Wrong argument(s). Use the \`help\` command.');
			}
			for (let i = 0; i < parsedArgs.length; ++i) {
				if (parsedArgs[i].type === 'user') data.push(infoString(parsedArgs[i].user));
				else if (parsedArgs[i].type === 'member') data.push(infoString(parsedArgs[i].member.user));
			}
		}

		message.channel.send('>>> ' + data.join('═══════════════════════════\n'), { split: { prepend: '>>> ' } });
	}
};

const { parseArguments } = require('../global.js');

const infoString = user => {
	return `**Name:** ${user.username}\n`
		  +`**Tag:** ${user.tag}\n`
		  +`**id:** ${user.id}\n`
		  +`**Created at:** ${user.createdAt}\n`;
}
