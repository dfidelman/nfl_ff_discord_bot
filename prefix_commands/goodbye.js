const { EmbedBuilder } = require("discord.js");
const client = require("../index");
const config = require("../config.json");

module.exports = {
  config: {
    name: "?goodbye",
    description: "Replies with Bye!",
  },
  permissions: ['SendMessages'],
  execute: async (client, message, config) => {

    message.reply({ embeds: [
      new EmbedBuilder()
        .setDescription(`Bye!`)
    ]})
  },
};