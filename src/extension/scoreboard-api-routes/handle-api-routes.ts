import { randomUUID } from "crypto";
import { MatchActions } from "types/schemas/match-actions";
import { scoreboardActions } from "./scoreboard-actions";
import { NodeCG } from "/.nodecg/types/server";
import { MatchActionType, Team } from "/src/hooks/use-match-actions/types";

const MATCH_ACTIONS_REPLICANT_NAME = "match-actions";

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();

  const { removeLastGoal, addGoal } = scoreboardActions(nodecg, randomUUID);

  const actions = nodecg.Replicant<MatchActions>(
    MATCH_ACTIONS_REPLICANT_NAME,
    nodecg.bundleName,
    {
      defaultValue: [],
      persistent: true,
    }
  );

  router.get("/:team/goals", (req, res) => {
    const team = (req.params.team as Team).toUpperCase();

    if (team === undefined || team === null) {
      return res.status(400).json({ error: "team is required" });
    }

    const result = actions.value.filter(
      (action) =>
        action.team.toUpperCase() === team &&
        action.action === MatchActionType.GOAL
    );

    return res.json({
      payload: { actions: result, total: result.length },
    });
  });

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
