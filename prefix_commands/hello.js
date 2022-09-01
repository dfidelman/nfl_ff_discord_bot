const { EmbedBuilder } = require("discord.js");
const client = require("../index");
const config = require("../config.json");

module.exports = {
  config: {
    name: "?hello",
    description: "Replies with Hi!",
  },
  permissions: ['SendMessages'],
  execute: async (client, message, config) => {

    message.reply({ embeds: [
      new EmbedBuilder()
        .setDescription(`Hi!`)
    ]})
  },
};