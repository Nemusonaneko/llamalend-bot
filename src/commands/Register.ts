import { SlashCommandBuilder } from "discord.js";
import { ethers } from "ethers";
import { execute } from "../utils/sql";
import { Command } from "./Command";

export const Register: Command = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registers Discord Account to address")
    .addStringOption((option) =>
      option
        .setName("address")
        .setDescription("Address to notify")
        .setRequired(true)
    ) as SlashCommandBuilder,
  run: async (interaction) => {
    try {
      const id = interaction.user.id;
      const address = interaction.options.get("address")?.value?.toString();
      if (address && ethers.utils.isAddress(address)) {
        await execute("INSERT INTO `discord` VALUES (?, ?, ?)", [
          Date.now() / 1e3,
          id,
          address?.toLowerCase(),
        ]);
        interaction.reply({
          content: `Added: ${address}`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `Invalid address: ${address}`,
          ephemeral: true,
        });
      }
    } catch (error: any) {
      interaction.reply({
        content: `Failed: ${error}`,
        ephemeral: true,
      });
    }
  },
};
