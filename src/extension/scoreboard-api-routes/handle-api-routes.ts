import { randomUUID } from "crypto";
import { scoreboardActions } from "./scoreboard-actions";
import { NodeCG } from "/.nodecg/types/server";
import { Team } from "/src/hooks/use-match-actions/types";

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();

  const { removeLastGoal, addGoal } = scoreboardActions(nodecg, randomUUID);

  router.get("/:team/add", (req, res) => {
    try {
      const team = req.params.team.toUpperCase() as Team;
      if (!(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      addGoal(team);
      return res.sendStatus(200);
    } catch (e) {
      console.error(e);
    }
    return res.sendStatus(500);
  });

  router.get("/:team/remove", (req, res) => {
    try {
      const team = req.params.team.toUpperCase() as Team;
      if (!(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      removeLastGoal(team);
      return res.sendStatus(200);
    } catch (e) {
      console.error(e);
    }
    return res.sendStatus(500);
  });

  nodecg.mount(`/${nodecg.bundleName}/scoreboard`, router);
}
