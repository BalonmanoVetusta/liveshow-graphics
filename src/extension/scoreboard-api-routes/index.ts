import { handleApiRoutes } from "./handle-api-routes";
import { NodeCG } from "/.nodecg/types/server";

export async function scoreboardApiRoutes(nodecg: NodeCG): Promise<void> {
  handleApiRoutes(nodecg);
}
