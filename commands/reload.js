module.exports = {
	name: 'reload',
	description: 'Reloads a specified command.',
	usage: '<command name>',
	args: true,
	execute(message, args) {
		const { commands } = message.client;
		const commandName = args[0].toLowerCase();
		const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`!`);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading the command \`${command.name}\`.`);
		}
	}
};
