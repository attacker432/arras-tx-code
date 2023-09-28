const { EmbedBuilder } = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msglogs = new Keyv(process.env.msgLogs);
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = async (client, message) => {
  if (!message.member) return;
  if (message.content.length > 1024) return;
  const log = message.guild.channels.cache.find((ch) => ch.name === `message-logs`);
  if (log) {
    let color = getRoleColor(message.guild);
    const deleteEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`Message Deleted`)
      .addFields(
        { name: 'Author:', value: message.member.user.username },
        { name: 'Channel:', value: `<#${message.channel.id}>` },
        { name: 'Content:', value: message.content }
      )
    .setFooter(  {
    text: `${message.member.user.username}`,
    iconURL: message.member.user.displayAvatarURL(),
  })
      .setTimestamp();
    log.send({ embeds: [deleteEmbed] });
  }
}