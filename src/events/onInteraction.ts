import { Interaction } from "discord.js";
import { CommandList } from "../commands/CommandList";

export const onInteraction = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  for (const command of CommandList) {
    if (interaction.commandName === command.data.name) {
        await command.run(interaction);
        break;
    }
  }
};
