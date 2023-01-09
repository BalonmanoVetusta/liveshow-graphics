import { randomUUID } from "crypto";
import { MatchActions } from "types/schemas/match-actions";
import { scoreboardActions } from "./scoreboard-actions";
import { NodeCG } from "/.nodecg/types/server";
import { MatchActionType, Team } from "/src/hooks/use-match-actions/types";

const MATCH_ACTIONS_REPLICANT_NAME = "match-actions";

function getActions(nodecg: NodeCG) {
  const actions =
    nodecg.readReplicant<MatchActions>(
      MATCH_ACTIONS_REPLICANT_NAME,
      nodecg.bundleName
    ) || [];

  return { actions };
}

function getTeamGoals(nodecg: NodeCG, team: Team) {
  const { actions } = getActions(nodecg);

  const teamGoals = actions.filter(
    ({ action, team: currentTeam }) =>
      currentTeam === team && action === MatchActionType.GOAL
  );

  return { total: teamGoals.length, teamGoals };
}

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();

  const { removeLastGoal, addGoal } = scoreboardActions(nodecg, randomUUID);

  router.get("/:team/goals", (req, res) => {
    const team = req.params.team.toUpperCase() as Team;

    if (team === undefined || team === null) {
      return res.status(400).json({ error: "team is required" });
    }

    return res.json({
      payload: getTeamGoals(nodecg, team),
    });
  });

  router.get("/:team/add", (req, res) => {
    try {
      const team = req.params.team.toUpperCase() as Team;

      if (!(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      addGoal(team);

      return res.json({
        payload: getTeamGoals(nodecg, team),
      });
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

      return res.json({
        payload: getTeamGoals(nodecg, team),
      });
    } catch (e) {
      console.error(e);
    }
    return res.sendStatus(500);
  });

  nodecg.mount(`/${nodecg.bundleName}/scoreboard`, router);
}
