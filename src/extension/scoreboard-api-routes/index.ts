import type NodeCG from "@nodecg/types";
import { handleScoreboardApiRoutes } from "./handle-scoreboard-api-routes";

export async function scoreboardApiRoutes(nodecg: NodeCG.ServerAPI): Promise<void> {
  nodecg.log.info("Initializing scoreboard-api-routes");
  handleScoreboardApiRoutes(nodecg);
  nodecg.log.info("scoreboard-api-routes initialized");
}
