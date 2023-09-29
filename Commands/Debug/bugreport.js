const { SlashCommandBuilder } = require('@discordjs/builders');
const { bugChId, urls: { discordInviteLink } } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription(`Submits a bug report directly to the bot's Discord server.`)
    .addStringOption((option) => option
      .setName('bug')
      .setDescription('The bug you want to report.')
      .setRequired(true)
    ),
  async execute(interaction) {
    const author = interaction.member.user.username;
    let bug = interaction.options.getString('bug');
    let channel = await interaction.client.channels.fetch(bugChId)
      await channel.send(`__Bug reported by ${author}__\n\n${bug}`);
    interaction.reply({ content: `Your bug has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: ${discordInviteLink}`, ephemeral: true });
  }
}