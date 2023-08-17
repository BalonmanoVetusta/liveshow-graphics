import type NodeCG from "@nodecg/types";
import { handleApiRoutes } from "./handle-api-routes";

export async function scoreboardApiRoutes(nodecg: NodeCG.ServerAPI): Promise<void> {
  nodecg.log.info("Initializing scoreboard-api-routes");
  handleApiRoutes(nodecg);
  nodecg.log.info("scoreboard-api-routes initialized");
}
