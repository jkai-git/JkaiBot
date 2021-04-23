module.exports = {
	name: 'reload',
	description: 'Reloads a specified command.',
	usage: '<command name>',
	args: true,
	execute(message, args) {
		// Find command
		const command = findCommand(args[0]);
		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${args[0]}\`!`);
		}

		// Delete command from require cache
		delete require.cache[require.resolve(`./${command.name}.js`)];

		// Load in new command
		try {
			const newCommand = require(`./${command.name}.js`);
			commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading the command \`${command.name}\`.`);
		}
	}
};

const { commands, findCommand } = require('../global.js');
