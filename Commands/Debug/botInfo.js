const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription(`Checks how many servers the bot is in.`),
  async execute(interaction) {
    let color = getRoleColor(interaction.guild);
    if (interaction.guild.roles.highest.color === 0) color = '#b9bbbe';
    else color = "009900";
    let membercount = 0;
    interaction.client.guilds.cache.forEach((guild) => membercount += guild.memberCount);
    const infoEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('Bot info')
      .addFields(
        { name: 'Server Count', value: interaction.client.guilds.cache.size.toString() },
        { name: 'User Count', value: membercount.toString() }
      )
      .setTimestamp();
    interaction.reply({ embeds: [infoEmbed] });
  }
}