const fetch = require("node-fetch");
const axios = require("axios"); // API interaction package.
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription(`Kicks a player ingame`)
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription(`The password to verify authentication.`)
        .setRequired(true)
    )
  .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription(`The id of the player to kick, get ids by using /list`)
        .setRequired(true)
    )
  .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription(`The reason for the kick.`)
        .setRequired(true)
    ),
  async execute(interaction) {
    let password = interaction.options.getString("password");
    let reason = interaction.options.getString("reason");
    let playerId = interaction.options.getInteger("id");
    
    if (password !== process.env.API_password) {
      let errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setTitle("Error")
        .setDescription("The password you provided is invalid.")
        .setFooter({
          text: `HTTP status: 406`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      return;
    }
    let url = "https://arras-tx.glitch.me/execute";
    const data = {
      password: password,
      command: 'kickPlayer',
      id: playerId,
      reason: reason,
      moderator: interaction.user.username
    };
   
    axios.post(url, data) // post the request to the API
      .then((response) => { // fetch the response status and message
        let embed = new EmbedBuilder()
      .setColor(348303)
      .setTitle("Success!")
      .setDescription(`HTTP status: **${response.data.status}** \n Status Message: **${response.data.message}**`)
      .setFooter({
        text: `Command Requested by: ${interaction.user.username}.`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
    interaction.reply({ embeds: [embed], ephemeral: true });
    })
      .catch((error) => {
        console.error(`[ERROR at kick.js]:  ${error}`);
      });

  },
};
