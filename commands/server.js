module.exports = {
	name: 'server',
	description: 'Informations about the server.',
	guildOnly: true,
	async execute(message, args) {
		const guildOwner = await message.guild.members.fetch(message.guild.ownerID);
		message.channel.send(`>>> **Server name:** ${message.guild.name}\n`
								+`**Server id:** ${message.guild.id}\n`
								+`**Server owner:** ${guildOwner.user.tag}\n`
								+`**Total members:** ${message.guild.memberCount}\n`
								+`**Created at:** ${message.guild.createdAt}\n`
								+`**Region:** ${message.guild.region}`);
	}
};
