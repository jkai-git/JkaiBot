module.exports = {
	name: 'user',
	description: 'Informations about the user.',
	execute(message, args) {
		message.channel.send(`Nickname: ${message.author.username}\n`
							+`Tag: ${message.author.tag}\n`
							+`id: ${message.author.id}\n`
							+`Created at: ${message.author.createdAt}\n`);
	}
};
