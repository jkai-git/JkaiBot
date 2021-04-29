const Ytdl = require('ytdl-core-discord');
const Search = require('youtube-search');
const { client } = require('./index.js');
const Discord = require('discord.js');

const connections = client.voice.connections;

const menuReacts = ['⏮', '⏯', '⏭', '🔀', '🔁', '⏹', '📂', '🔎'];
const menuReactionFilter = reaction => menuReacts.includes(reaction.emoji.name);

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

const playerEmbed = connection => {
	if (connection.queue.length && connection.queue[0].data) {
		const videoDetails = connection.queue[0].data.videoDetails;
		const videoThumbnail = videoDetails.thumbnails[videoDetails.thumbnails.length - 1];
		return new Discord.MessageEmbed()
			.setColor('#06AED5')
			.setTitle(videoDetails.title)
			.setURL(videoDetails.video_url)
			.setAuthor(videoDetails.author.name, videoDetails.author.thumbnails[videoDetails.author.thumbnails.length - 1].url, videoDetails.author.channel_url)
			.setDescription(connection.playerStatus)
			.setThumbnail(`https://cdn.filestackcontent.com/${process.env.FILESTACK_APIKEY}/resize=width:${videoThumbnail.height},height:${videoThumbnail.height},fit:crop/${videoThumbnail.url}`);
	} else {
		return new Discord.MessageEmbed()
			.setColor('#FFFFFE')
			.setTitle('Music Player Connected')
			.setAuthor(`provided by ${client.user.tag}`, client.user.displayAvatarURL())
			.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nwaiting for input...')
			.setThumbnail(client.user.displayAvatarURL());
	}
}

const reAlignPlayer = () => {

}

const reactionResponse = react => {
	switch(react.emoji.name) {
		case '⏮':

			break;
		case '⏯':

			break;
		case '⏭':

			break;
		case '🔀':

			break;
		case '🔁':

			break;
		case '⏹':

			break;
		case '📂':

			break;
		case '🔎':

			break;
	}
}

const activateMenu = async message => {
	try {
		for (const react of menuReacts) {
			await message.react(react);
		}
		const reactionCollector = message.createReactionCollector(menuReactionFilter, { dispose: true });
		reactionCollector.on('collect', react => reactionResponse(react));
		reactionCollector.on('remove', react => reactionResponse(react));
	} catch(error) {
		console.error('There was an error while reacting the Player Menu Buttons: \n', error);
	}
}

const buildPlayer = async channel => {
	const connection = connections.get(channel.guild.id);

	try {
		const msg = await channel.send(playerEmbed(connection));
		connection.messages.set('player', msg);
		activateMenu(msg);

		if (connection.queue.length) {
			const msg2 = await channel.send(lastInQueueEmbed(connection));
			connection.messages.set('lastInQueue', msg2);
		}
	} catch(error) {
		console.error('MusicPlayer.buildPlayer error: \n', error);
	}
}

const updatePlayer = (type, connection) => {
	if (!connection.messages.has(type)) return;
	const msg = connection.messages.get(type);
	switch (type) {
		case 'player':
			msg.edit(playerEmbed(connection));
			break;
		case 'queue':
// later
			break;
		case 'lastInQueue':
// later, also build lastInQueue if it isnt and there is something in queue, also delete if queue empty
			break;
	}
}

const addToQueue = async (music, message, channel) => {
	const connection = connections.get(channel.guild.id);
	clearTimeout(connection.timeout);

	let video;
	let fail = false;
	if (music[0].startsWith('https://')) {
		try {
			video = await Ytdl.getBasicInfo(music[0]);
		} catch(error) {
			console.error('addToQueue error! \n', error);
			fail = true;
		}
	} else {
		const opts = {
		 	maxResults: 1,
		  	key: process.env.YOUTUBE_APIKEY,
		  	type: 'video'
		};

		try {
			const data = await Search(music.join(' '), opts);
			video = await Ytdl.getBasicInfo(data.results[0].link);
		} catch(error) {
			fail = true;
			console.error('Youtube Search error! \n', error);
		}
	}

	if (fail) connection.queue.push({ sender: message.member.displayName, data: null });
	else {
		connection.queue.push({ sender: message.member.displayName, data: video });
	}

	updatePlayer('queue', connection);
	updatePlayer('lastInQueue', connection);

	if (!connection.dispatcher) await play(channel);
}

const join = async channel => {
	let connection;

	try {
		connection = await channel.join();
	} catch (error) {
		console.error('MusicPlayer.Join() error: \n', error);
		return false;
	}

	connection.voice.setSelfDeaf(true);

	connection.messages = new Discord.Collection();
	connection.queue = [];
	connection.timeout = setTimeout(connection => connection.disconnect(), 120000, connection);
	connection.playerStatus = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nwaiting for input...';

	connection.once('disconnect', () => {
		connection.messages.each(msg => msg.delete());
		clearTimeout(connection.timeout);
	});

	return true;
}

const play = async channel => {
	const connection = connections.get(channel.guild.id);

	if (!connection.queue.length) {
		clearTimeout(connection.timeout);
		connection.timeout = setTimeout(connection => connection.disconnect(), 120000, connection);
		connection.playerStatus = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nwaiting for input...';
		updatePlayer('player', connection);
		return;
	}
	if (!connection.queue[0].data) {
		connection.queue.shift();
		play(channel);
		return;
	}

	const stream = await Ytdl(connection.queue[0].data.videoDetails.video_url, ytdlOptions);
	const dispatcher = connection.play(stream, dispatcherOptions);
	dispatcher.once('finish', () => {
		connection.queue.shift();
		play(channel);
	});

	connection.playerStatus = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nplaying music...';

	updatePlayer('player', connection);
	updatePlayer('queue', connection);
}

const isJoined = guildID => {
	return connections.has(guildID);
}

module.exports = {
	isJoined, join, connections, buildPlayer, addToQueue, reAlignPlayer
};
