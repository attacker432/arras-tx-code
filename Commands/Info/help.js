const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { helpEmojis, urls } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const config = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(`Displays a list of all available commands along with their usage.`),
  async execute(interaction) {
    const { staffEmojiId, infoEmojiId, loggingEmojiId, welcomeEmojiId, funEmojiId, debugEmojiId } = helpEmojis;
    const { botInviteLink, discordInviteLink, topgg, website, github } = urls;
    let color = getRoleColor(interaction.guild);
    console.log(color)
    let debugCmds = '';
    let infoCmds = '';
    let adminCmds = '';
    fs.readdirSync('./Commands/Debug').forEach((file) => {
      debugCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Info').forEach((file) => {
      infoCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/admin').forEach((file) => {
      adminCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
   console.log(interaction.client.emojis.cache)
    const helpEmbed = new EmbedBuilder()
      .setColor(`#2AFF00`)
      .setTitle('Commands')
      .addFields(
        {
          name: `**Admin Commands**`,
          value: `${'```' + adminCmds + '```'}`, inline: true
        },
        {
          name: `**Info Commands**`,
          value: `${'```' + infoCmds + '```'}`, inline: true
        },
        {
          name: `**Debug Commands**`,
          value: `${'```' + debugCmds + '```'}`, inline: true
        }
      )
      .setTimestamp();
    const links = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Add me')
        .setURL(botInviteLink)
        .setStyle('Link'),
      new ButtonBuilder()
        .setLabel('Support')
        .setURL(discordInviteLink)
        .setStyle('Link'),
      new ButtonBuilder()
        .setLabel('Vote!')
        .setURL(topgg)
        .setStyle('Link'),
     /* new ButtonBuilder()
        .setLabel('Website')
        .setURL(website)
        .setStyle('Link'), */ // Website is not here yet
      new ButtonBuilder()
        .setLabel('Code')
        .setURL(github)
        .setStyle('Link')
    );
    interaction.reply({ embeds: [helpEmbed], components: [links] });
    console.log(config.authenticated_users)
  }
}