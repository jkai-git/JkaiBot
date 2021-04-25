module.exports = {
	name: 'help',
	description: 'List all the commands or information about a specific command.',
	usage: '(optional)<command name>',
	aliases: ['commands', 'cmds'],
	async execute(message, args) {
		const data = [];

		// if no args, send list of all commands to DM
		if (!args.length) {
			data.push('**List of all commands:**');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can try \`${Config.defaultPrefix}${this.name} <command name>\` to get info on a specific command.`);

			return message.author.send('>>> ' + data.join('\n'), { split: { prepend: '>>> ' } })
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
		const command = findCommand(args[0]);
		if (!command) {
			return message.channel.send('That\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);
		data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${await getPrefix(message.guild)}${command.name} ${command.usage}`);
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		data.push(`**Cooldown:** ${command.cooldown || Config.defaultCooldown} second(s)`);

		message.channel.send('>>> ' + data.join('\n'), { split: { prepend: '>>> ' } });
	}
};

const { commands, getPrefix, findCommand } = require('../global.js');
const Config = require('../config.json');
