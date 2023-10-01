import type NodeCG from "@nodecg/types";
import { handleScoreboardApiRoutes } from "./handle-scoreboard-api-routes";

export async function scoreboardApiRoutes(nodecg: NodeCG.ServerAPI): Promise<void> {
  handleScoreboardApiRoutes(nodecg);
}
