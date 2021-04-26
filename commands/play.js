module.exports = {
	name: 'play',
	description: 'Plays/Enqueues music. (youtube)',
	usage: '(optional)<url> (optional)<text>',
	aliases: ['enqueue'],
	guildOnly: true,
	args: true,
	cooldown: 3,
	async execute(message, args) {
		if (!connections.has(message.guild.id)) await commands.get('join').execute(message, args);
		if (!connections.has(message.guild.id)) return;
		const connection = connections.get(message.guild.id);
		if (!message.member.voice.channel || connection.channel.id != message.member.voice.channel.id) {
			return message.channel.send(`You must be in my voice channel to use \`${await getPrefix(message.guild)}${this.name}\`.`);
		}

		const video = await Ytdl.getInfo('https://www.youtube.com/watch?v=Zgi0Gzjxvjw');
		const videoDetails = video.videoDetails;
		const videoThumbnail = videoDetails.thumbnails[videoDetails.thumbnails.length - 1];

		const dispatcher = connection.play(await Ytdl('https://www.youtube.com/watch?v=Zgi0Gzjxvjw', ytdlOptions), dispatcherOptions);

		const start = Date.now();

		const embed = new Discord.MessageEmbed()
			.setColor('#06AED5')
			.setTitle(videoDetails.title)
			.setURL(videoDetails.video_url)
			.setAuthor(videoDetails.author.name, videoDetails.author.thumbnails[videoDetails.author.thumbnails.length - 1].url, videoDetails.author.channel_url)
			.setDescription(`[00:00:00]:white_circle:▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬[${timeFormatter(videoDetails.lengthSeconds)}]`)
			.setThumbnail(`https://cdn.filestackcontent.com/${process.env.FILESTACK_APIKEY}/resize=width:${videoThumbnail.height},height:${videoThumbnail.height},fit:crop/${videoThumbnail.url}`);

		message.client.setInterval(embedUpdate, 10000, await message.channel.send(embed), embed, start, videoDetails.lengthSeconds);
	}
};

const { connections, commands, getPrefix } = require('../global.js');
const Ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');

const timeFormatter = secs => new Date(secs * 1000).toISOString().substr(11, 8);

const embedUpdate = (message, embed, start, length) => {
	const at = (Date.now() - start) / 1000;
	const percent = (17 * at / length) | 0;
	embed.setDescription(`[${timeFormatter(at)}]` + '▬'.repeat(percent) + ':white_circle:' + '▬'.repeat(17 - percent) + `[${timeFormatter(length)}]`);
	message.edit(embed);
}

const ytdlOptions = {
	quality: 'highestaudio',
	filter: 'audioonly'
};

const dispatcherOptions = {
	type: 'opus',
	bitrate: 'auto',
	highWaterMark: 50,
	volume: false
};
