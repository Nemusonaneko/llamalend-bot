import { Client } from "discord.js";
import { execute } from "../utils/sql";
import fetch from "node-fetch";

export const NotifyUsers = async (client: Client, lastHour: boolean) => {
  const now = Math.round(Date.now() / 1e3);
  const start = lastHour ? now : now + 24 * 3600;
  const end = lastHour ? now + 3600 * 1.5 : now + 25 * 3600;
  const loans = await getLoansInDeadline(start, end);

  await Promise.all(
    loans.map(async (loan) => {
      const ids = await execute(
        `SELECT ADDRESS, ID FROM discord WHERE address =?;`,
        [loan.owner.toLowerCase()]
      );
      await Promise.all(
        (ids[0] as any[]).map((id) => {
          const message = `\n${
            lastHour
              ? "LlamaLend: 1hr till liquidation"
              : "LlamaLend: 24 hours till liquidation"
          }\nYour loan on LlamaLend in pool ${loan.pool.name} for NFT ${
            loan.nftId
          } will be liquidated in ${(
            (Number(loan.deadline) - now) /
            60
          ).toFixed(
            2
          )} minutes \nGo to https://llamalend.com/repay to repay the loan.`;
          client.users.fetch(id.ID).then((user) => user.send(message));
        })
      );
    })
  );
};

async function getLoansInDeadline(start:number, end:number){
  const loanData = await fetch("https://api.thegraph.com/subgraphs/name/0xngmi/llamalend", {
        method: "POST",
        body: JSON.stringify({
            query:
`query getloan($start: BigInt, $end: BigInt){
	loans(where: {
		deadline_gte: $start,
		deadline_lte: $end,
	}){
		id
		owner
		nftId
		deadline
		pool{
			name
		}
	}
}`,
            variables:{
                start,
                end,
            }
        })
    }).then(r=>r.json())
    return (loanData.data.loans as {
      "id": string,
      "owner": string,
      "nftId": string,
      "deadline": string,
      "pool": {
        "name": string
      }
    }[]).filter(loan=>loan.owner !== "0x0000000000000000000000000000000000000000")
}
