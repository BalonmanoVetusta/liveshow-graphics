import { v4 as uuidV4 } from "uuid";
import { MatchActions } from "types/schemas/match-actions";
import { scoreboardActions } from "./scoreboard-actions";
import type NodeCG from "@nodecg/types";
import { MatchActionType, Team } from "/src/hooks/use-match-actions/types";

const MATCH_ACTIONS_REPLICANT_NAME = "match-actions";

function getActions(nodecg: NodeCG.ServerAPI) {
  const actions = nodecg.readReplicant<MatchActions>(MATCH_ACTIONS_REPLICANT_NAME, nodecg.bundleName) || [];

  return { actions };
}

function getTeamGoals(nodecg: NodeCG.ServerAPI, team: Team) {
  const { actions } = getActions(nodecg);

  const teamGoals = actions.filter(
    ({ action, team: currentTeam }) => currentTeam === team && action === MatchActionType.GOAL,
  );

  return teamGoals.length;
}

export function handleScoreboardApiRoutes(nodecg: NodeCG.ServerAPI) {
  nodecg.log.info("Initializing scoreboard-api-routes");
  const router = nodecg.Router();

  const { removeLastGoal, addGoal, removeActionsByTeam } = scoreboardActions(nodecg, uuidV4);

  // Team handlers
  router.get("/:team", (req, res) => {
    const team = req.params.team.toUpperCase() as Team;

    if (team === undefined || team === null) {
      return res.status(400).json({ error: "team is required" });
    }

    if (!(team in Team)) {
      return res.sendStatus(422); // Unprocessable Entity: Team not valid string
    }

    return res.json(getTeamGoals(nodecg, team));
  });

  router.post("/:team", (req, res) => {
    try {
      const team = req.params.team.toUpperCase() as Team;

      if (!(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      addGoal(team);

      return res.json(getTeamGoals(nodecg, team));
    } catch (e) {
      // console.error(e);
      return res.sendStatus(422);
    }
  });

  router.put("/:team", (req, res) => {
    try {
      const team = req.params.team.toUpperCase() as Team;
      const score = parseInt(req.body?.score);

      if (!(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      if (isNaN(score) || (req.body?.score && !isFinite(req.body?.score)) || score < 0) {
        throw new Error(`Invalid score: ${score}`);
      }

      removeActionsByTeam(team, MatchActionType.GOAL);
      for (let i = 0; i < score; i++) {
        addGoal(team);
      }

      return res.sendStatus(200);
    } catch (e) {
      console.error(e);
      return res.sendStatus(422); // Unprocessable Entity
    }
  });

  router.delete("/:team", (req, res) => {
    try {
      const team = req.params.team.toUpperCase() as Team;

      if (!(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      removeLastGoal(team);

      return res.sendStatus(200);
    } catch (e) {
      // console.error(e);
      return res.sendStatus(422);
    }
  });

  // Reset all goals handlers
  router.delete("/reset/:team", (req, res) => {
    try {
      if (!req.params.team) {
        removeActionsByTeam(Team.LOCAL, MatchActionType.GOAL);
        removeActionsByTeam(Team.VISITOR, MatchActionType.GOAL);
        return res.sendStatus(200);
      }

      const team = req.params.team?.toUpperCase() as Team;
      if (team && !(team in Team)) {
        throw new Error(`Invalid team: ${team}`);
      }

      if (team) removeActionsByTeam(team, MatchActionType.GOAL);

      return res.sendStatus(200);
    } catch (e) {
      console.error(e);
      return res.sendStatus(422);
    }
  });

  nodecg.mount(`/${nodecg.bundleName}/scoreboard`, router);
}
