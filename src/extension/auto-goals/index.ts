import type NodeCG from "@nodecg/types";
import { handleAutoGoalsApiRoutes } from "./handle-auto-goals-api-routes";
import { handleAutoGoalsTasks } from "./handle-auto-goals-tasks";

export async function autoGoalsApiRoutes(nodecg: NodeCG.ServerAPI): Promise<void> {
  handleAutoGoalsApiRoutes(nodecg);
  handleAutoGoalsTasks(nodecg);
}
