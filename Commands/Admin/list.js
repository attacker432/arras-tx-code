const fetch = require("node-fetch");
const axios = require("axios"); // API interaction package.
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const config = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription(`Lists all entities currently ingame.`)
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription(`The password to verify authentication.`)
        .setRequired(true)
    ),
  async execute(interaction) {
    let password = interaction.options.getString("password");
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
      command: 'listEntities'
    };
    
   
    axios.post(url, data) // post the request to the API
      .then((response) => { // fetch the response status and message
        let embed = new EmbedBuilder()
      .setColor(348303)
      .setTitle("Success!")
      .setDescription(`HTTP status: **${response.data.status}** \n Status Message: **${response.data.message}**`)
      .addFields(
      {
        name: 'Entity List', value: `${response.data.list}`
      })
      .setFooter({
        text: `Command Requested by: ${interaction.user.username}.`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
    interaction.reply({ embeds: [embed], ephemeral: true });
    })
      .catch((error) => {
        console.error(`[ERROR at list.js]:  ${error}`);
      });

  },
};
