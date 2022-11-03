import { SlashCommandBuilder } from "discord.js";
import { Command } from "./Command";

export const Help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help list"),
  run: async (interaction) => {
    await interaction.reply("Same")
  },
};
