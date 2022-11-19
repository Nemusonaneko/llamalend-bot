import { SlashCommandBuilder } from "discord.js";
import { execute } from "../utils/sql";
import { Command } from "./Command";
import fetch from "node-fetch";

export const Loans: Command = {
  data: new SlashCommandBuilder()
    .setName("loans")
    .setDescription("List of active loans"),
  run: async (interaction) => {
    try {
      const id = interaction.user.id;
      const now = Math.round(Date.now() / 1e3);
      const addressQuery = await execute(
        `SELECT ADDRESS FROM discord WHERE ID =?;`,
        [id]
      );
      const addresses: string[] = [];
      (addressQuery[0] as any[]).map((address) => {
        addresses.push(address.ADDRESS);
      });
      let message = "";
      for (let i = 0; i < addresses.length; i++) {
        const loans = await getLoans(addresses[i]);
        for (let j = 0; j < loans.length; j++) {
          const loan = loans[i];
          message += `${loan.pool.name} loan for NFT ID ${
            loan.nftId
          } will expire in ${((Number(loan.deadline) - now) / 86400).toFixed(
            2
          )} days\n`;
        }
      }
      message += "Go to https://llamalend.com/repay to repay your loans.";
      interaction.reply({ ephemeral: true, content: message });
    } catch (error: any) {
      interaction.reply({ ephemeral: true, content: `Error: ${error}` });
    }
  },
};

async function getLoans(address: string) {
  const loanData = await fetch(
    "https://api.thegraph.com/subgraphs/name/0xngmi/llamalend",
    {
      method: "POST",
      body: JSON.stringify({
        query: `query getLoan($address : Bytes) {
            loans(where: {owner: $address}) {
                id
                nftId
                deadline
                pool {
                  name
                }
              }
            }`,
        variables: {
          address,
        },
      }),
    }
  ).then((r) => r.json());
  return loanData.data.loans as {
    id: string;
    nftId: string;
    deadline: number;
    pool: {
      name: string;
    };
  }[];
}
