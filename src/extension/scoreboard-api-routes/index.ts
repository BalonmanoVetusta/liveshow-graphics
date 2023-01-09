import { handleApiRoutes } from "./handle-api-routes";
import { NodeCG } from "/.nodecg/types/server";

export async function scoreboardApiRoutes(nodecg: NodeCG): Promise<void> {
  nodecg.log.info("Initializing scoreboard-api-routes");
  handleApiRoutes(nodecg);
  nodecg.log.info("scoreboard-api-routes initialized");
}
