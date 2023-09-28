const { EmbedBuilder } = require('discord.js');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = async (client, oldmsg, newmsg) => {
  if (!oldmsg.member || !newmsg.member) return;
  if (!newmsg.editedTimestamp || newmsg.member.user.bot) return;
  if (oldmsg.content.length > 1024 || newmsg.content.length > 1024) return;
  const log = newmsg.guild.channels.cache.find((ch) => ch.name === `message-logs`);
  if (log) {
    let color = getRoleColor(newmsg.guild);
    const editEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`Message Edited`)
      .addFields(
        { name: 'Author:', value: newmsg.member.user.username },
        { name: 'Channel:', value: `<#${newmsg.channel.id}>` },
        { name: 'Initial Content:', value: oldmsg.content },
        { name: 'New Content:', value: newmsg.content }
      )
     .setFooter(  {
    text: `${newmsg.member.user.username}`,
    iconURL: newmsg.member.user.displayAvatarURL(),
  })
      .setTimestamp();
    log.send({ embeds: [editEmbed] });
  }
}