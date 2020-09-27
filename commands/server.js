module.exports = {
	name: 'server',
	description: 'Informations about the server.',
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\n`
							+`Server id: ${message.guild.id}\n`
							+`Server owner: ${message.guild.owner.tag}\n`
							+`Total members: ${message.guild.memberCount}\n`
							+`Created at: ${message.guild.createdAt}\n`
							+`Region: ${message.guild.region}`);
	}
};
