import type NodeCG from "@nodecg/types";
import { handleAutoGoalsApiRoutes } from "./handle-auto-goals-api-routes";
import { AutoGoals } from "types/schemas/auto-goals";
import { handleAutoGoalsTasks } from "./task";
import Cron from "croner";

let job: ReturnType<typeof Cron> | undefined;

export async function autoGoalsApiRoutes(nodecg: NodeCG.ServerAPI): Promise<void> {
  nodecg.log.info("Initializing auto-goals-api-routes");
  const autogoals = nodecg.Replicant<AutoGoals>("auto-goals", nodecg.bundleName, { defaultValue: {} });
  autogoals.on("change", async (newValue) => {
    if (newValue.active) {
      if (!job)
        handleAutoGoalsTasks(nodecg).then((j) => {
          job = j;
        });

      if (job && !job.isRunning()) job.resume();
    }

    if (!newValue.active && job && job.isRunning()) job.pause();
  });
  handleAutoGoalsApiRoutes(nodecg);
}
