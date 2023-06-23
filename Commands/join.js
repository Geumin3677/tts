const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('입장')
		.setDescription('채널에 입장합니다.'),

    async execute(interaction, client, lop) {
        if(!interaction.member?.voice?.channel)
        {
            interaction.reply({ content: `먼저 음성 채널에 들어가 주세요.`, ephemeral: true })
            return 0
        }

        const channel = interaction.member?.voice?.channel
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        interaction.reply("입장 성공")
    }
}