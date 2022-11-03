import { SlashCommandBuilder } from "discord.js";
import { execute } from "../utils/sql";
import { Command } from "./Command";

export const List: Command = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List of addresses registered"),
  run: async (interaction) => {
    try {
      const id = interaction.user.id;
      const addresses = await execute(
        `SELECT ADDRESS FROM discord WHERE ID =?;`,
        [id]
      );
      const converted = addresses[0] as any[];
      if (converted.length > 0) {
        let message = ``;
        converted.map((address) => {
          message += `${address.ADDRESS}\n`;
        });
        interaction.reply({ ephemeral: true, content: message });
      } else {
        interaction.reply({ ephemeral: true, content: "No addresses stored" });
      }
    } catch (error: any) {
      interaction.reply({ ephemeral: true, content: `Error: ${error}` });
    }
  },
};
