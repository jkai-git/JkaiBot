module.exports = {
	name: 'user',
	description: 'Informations about the mentioned user. (you can also use IDs)',
	usage: '(optional)<mention> (optional)<userID>',
	aliases: ['profile'],
	async execute(message, args) {
		// No args, author info
		if (!args.length) {
			return message.channel.send(infoString(message.author));
		}
		// Lookup user by id and info
		if (regexId.test(args[0])) {
			const user = await findUserById(args[0], message.client);
			if (!user) {
				return message.channel.send(`No user found for the following id: ${args[0]}`);
			}
			return message.channel.send(infoString(user));
		}
		// in guild mention info
		if (message.mentions.members && message.mentions.members.size) {
			return message.channel.send(infoString(message.mentions.members.first().user));
		}
		// in dm mention info
		if (message.mentions.users.size) {
			return message.channel.send(infoString(message.mentions.users.first()));
		}

		// WRONG ARGUMENT
		return message.channel.send('Wrong argument(s). Use the \`help\` command.');
	}
};

const { regexId, findUserById } = require('../global.js');

const infoString = user => {
	return `>>> **Nickname:** ${user.username}\n`
			  +`**Tag:** ${user.tag}\n`
			  +`**id:** ${user.id}\n`
			  +`**Created at:** ${user.createdAt}\n`;
}
