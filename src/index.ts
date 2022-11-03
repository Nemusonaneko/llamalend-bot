import * as dotenv from "dotenv";
dotenv.config();
import { Client, REST, Routes } from "discord.js";
import { onInteraction } from "./events/onInteraction";
import { CommandList } from "./commands/CommandList";
import { CronJob } from "cron";
import { NotifyUsers } from "./events/NotifyUsers";
import express from "express";

const client = new Client({ intents: [] });
const token = process.env.DISCORD_BOT_TOKEN || "no token";
const app = express();
const port = process.env.PORT;

client.on(
  "interactionCreate",
  async (interaction) => await onInteraction(interaction)
);

client.on("ready", async () => {
  if (!token) return;
  const rest = new REST({ version: "10" }).setToken(token);
  const commandData = CommandList.map((command) => command.data.toJSON());

  console.log("Loading commands");
  const result: any = await rest.put(
    // @ts-ignore
    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
    {
      body: commandData,
    }
  );
  result.forEach((command: any) => {
    console.log(`Loaded ${command.name}`);
  });
  console.log(`Loaded ${result.length} commands`);
  console.log(`Creating cron jobs`);
  console.log(`Creating hourly job`);
  const hourlyJob = new CronJob("0 * * * *", async function () {
    await NotifyUsers(client, true);
  });
  hourlyJob.start();
  console.log(`Creating daily job`);
  const dailyJob = new CronJob("0 0 * * *", async function () {
    await NotifyUsers(client, false);
  });
  dailyJob.start();
  console.log(`Cron jobs created`);
  console.log("Ready");
});

client.login(token);
app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}!`)
);
