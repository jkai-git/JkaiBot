module.exports = {
	name: 'help',
	description: 'List all the commands or information about a specific command.',
	aliases: ['commands', 'cmds'],
	usage: '(optional)<command name>',
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		// if no args, send list of all commands to DM
		if (!args.length) {
			data.push('List of all commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can try \`${Config.prefix}${this.name} <command name>\` to get info on a specific command.`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.channel.send('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.channel.send('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		// if args, detailed informations about the command
		const commandName = args[0].toLowerCase();
		const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send('That\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);
		data.push(`**Description:** ${command.description}`);
		data.push(`**Cooldown:** ${command.cooldown || Config.defaultCooldown} second(s)`);
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.usage) data.push(`**Usage:** ${Config.prefix}${command.name} ${command.usage}`);

		message.channel.send(data, { split: true, disableMentions: 'all' });
	}
};

const Config = require('../config.json');
