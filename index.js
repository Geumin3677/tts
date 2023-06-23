const { token, guildId } = require('./config.json');
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const fs = require('fs')
const path = require('node:path');
const deploycommands = require('./deploy-commands');
const googleTTS = require('google-tts-api');
const { getVoiceConnection } = require('@discordjs/voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const player = createAudioPlayer();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

async function getTime() {
	const curr = new Date();
	const utc = 
		curr.getTime() + 
		(curr.getTimezoneOffset() * 60 * 1000);
	const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
	const kr_curr = new Date((utc + KR_TIME_DIFF));
	const time = `${kr_curr.getFullYear()}-${kr_curr.getMonth() + 1}-${kr_curr.getDate()} ${kr_curr.getHours()}:${kr_curr.getMinutes()}:${kr_curr.getSeconds()}`
	return time
}

function makeRandom(min, max){
    var RandVal = Math.floor(Math.random()*(max-min+1)) + min;
    return RandVal;
}

client.on('ready', async () => {
    console.log('ttsBot is Ready! dev by ABELA')
})

client.on("messageCreate", async msg => {
	if(msg.member.id == "1117594057959551056")
	{
		var connection = getVoiceConnection(msg.guild.id)
		console.log(connection)
		if(connection == undefined)
        {
			var guild = client.guilds.cache.get(guildId)
            var channel = guild.channels.cache.find(channel => channel.id === "1105687963700051982")
			connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
        }

		let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

		const url = googleTTS.getAudioUrl(msg.content, {
            lang: 'ko',
            slow: false,
            host: 'https://translate.google.com',
        });
        const resource = createAudioResource(url);
        connection.subscribe(player)
        await sleep(1000)
        player.play(resource)
	}
})

client.on('interactionCreate', async interaction => {

	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		try {
			await interaction.reply({ content: '명령어 처리중 오류가 발생했습니다!', ephemeral: true });
		}catch {
			await interaction.editReply({ content: '명령어 처리중 오류가 발생했습니다!', ephemeral: true });
		}
	}
});

// process.on('unhandledRejection', (reason, p) => {
// 	console.log(`[antiCrash] [${getTime()}] 크레시가 감지 되었습니다! :: Unhandled Rejection/Catch`);
// });

// process.on("uncaughtException", (err, origin) => {
// 	console.log(`[antiCrash] [${getTime()}] 크레시가 감지 되었습니다! :: Uncaught Exception/Catch`);
// })

client.login(token);