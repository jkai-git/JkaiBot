module.exports = {
	name: 'user',
	description: 'Informations about the mentioned users. (you can also use IDs)',
	usage: '(optional)<mentions> (optional)<userIDs>',
	aliases: ['profile'],
	async execute(message, args) {
		// No args, author info
		if (!args.length) {
			return message.channel.send('>>> ' + infoString(message.author));
		}

		const parsedArgs = await parseArguments(args, message.client, message.guild);
		if (!parsedArgs) return message.channel.send('Something went wrong. It\'s probably an incorrect id.');
		if (!parsedArgs.filter(arg => arg.type === 'user' || arg.type === 'member').length) {
			return message.channel.send('Wrong argument(s). Use the \`help\` command.');
		}
		let data = [];
		for (let i = 0; i < parsedArgs.length; ++i) {
			if (parsedArgs[i].type === 'user') data.push(infoString(parsedArgs[i].user));
			else if (parsedArgs[i].type === 'member') data.push(infoString(parsedArgs[i].member.user));
		}
		message.channel.send('>>> ' + data.join('\n'));
	}
};

const { parseArguments } = require('../global.js');

const infoString = user => {
	return `**Name:** ${user.username}\n`
		  +`**Tag:** ${user.tag}\n`
		  +`**id:** ${user.id}\n`
		  +`**Created at:** ${user.createdAt}\n`;
}
