const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { joinVoiceChannel } = require('@discordjs/voice');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('퇴장')
		.setDescription('채널에서 퇴장합니다.'),

    async execute(interaction, client, lop) {
        if(!interaction.member?.voice?.channel)
        {
            interaction.reply({ content: `먼저 음성 채널에 들어가 주세요.`, ephemeral: true })
            return 0
        }

        const connection = getVoiceConnection(interaction.guild.id);
        connection.destroy()

        interaction.reply("퇴장 성공")
    }
}