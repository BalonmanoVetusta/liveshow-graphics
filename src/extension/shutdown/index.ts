import { handleApiRoutes } from "./handle-api-routes";
import { NodeCG } from "/.nodecg/types/server";

export default async function shutdownApi(nodecg: NodeCG) {
  nodecg.log.info("Setting up shutdown API routes...");
  handleApiRoutes(nodecg);
}
