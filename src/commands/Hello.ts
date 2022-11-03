import { SlashCommandBuilder } from "discord.js";
import { Command } from "./Command";

export const Hello: Command = {
    data: new SlashCommandBuilder().setName("hello").setDescription("Responds with Hello"),
    run: async(interaction) => {
        await interaction.reply("Hello!");
    }
}