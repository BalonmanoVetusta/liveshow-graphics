import { handleApiRoutes } from "./handle-api-routes";
import type NodeCG from "@nodecg/types";

export default async function shutdownApi(nodecg: NodeCG.ServerAPI) {
  nodecg.log.info("Setting up shutdown API routes...");
  handleApiRoutes(nodecg);
}
