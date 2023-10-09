import type NodeCG from "@nodecg/types";
import { AutoGoals } from "types/schemas/auto-goals";

const AUTO_GOALS_REPLICANT_NAME = "auto-goals";

let autoGoalsReplicant: NodeCG.ServerReplicant<AutoGoals> | undefined;

function getAutoGoalsReplicant(nodecg: NodeCG.ServerAPI) {
  if (!autoGoalsReplicant) {
    autoGoalsReplicant = nodecg.Replicant<AutoGoals>(AUTO_GOALS_REPLICANT_NAME, { defaultValue: {} });
  }

  return autoGoalsReplicant;
}

export function handleAutoGoalsApiRoutes(nodecg: NodeCG.ServerAPI) {
  nodecg.log.info("Initializing scoreboard-api-routes");
  const router = nodecg.Router();
  const autoGoals = getAutoGoalsReplicant(nodecg);

  // Team handlers
  router.get("/", (req, res) => {
    return res.json(autoGoals.value);
  });

  // Set custom status
  router.post("/", (req, res) => {
    try {
      const { active } = req.body;
      const activeLower = active.toLowerCase();
      let newStatus = activeLower in ["true", "1", "yes", "y", "on"];
      if (activeLower === "toggle") {
        newStatus = !active;
      }
      autoGoals.value ??= { active: false };
      autoGoals.value.active ??= newStatus;
      autoGoals.value.active = newStatus;

      return res.sendStatus(200).json({ active: autoGoals.value.active });
    } catch (e) {
      // console.error(e);
      return res.sendStatus(422);
    }
  });

  nodecg.mount(`/${nodecg.bundleName}/auto-goals`, router);
}
