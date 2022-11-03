import { SlashCommandBuilder } from "discord.js";
import { execute } from "../utils/sql";
import { Command } from "./Command";

export const Remove: Command = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove Registration to Address")
    .addStringOption((option) =>
      option
        .setName("address")
        .setDescription("Address to remove")
        .setRequired(true)
    ) as SlashCommandBuilder,
  run: async (interaction) => {
    try {
      const id = interaction.user.id;
      const address = interaction.options.get("address")?.value?.toString();
      await execute("DELETE FROM `discord` WHERE ID = (?) AND ADDRESS = (?)", [
        id,
        address?.toLowerCase(),
      ]);
      interaction.reply({ content: `Removed: ${address}`, ephemeral: true });
    } catch (error: any) {
      interaction.reply({ content: `Failed: ${error}` });
    }
  },
};
