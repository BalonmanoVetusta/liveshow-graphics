import type NodeCG from "@nodecg/types";
import {
  GoalActionType,
  MatchActionType,
  Team,
  UseMatchActionsAddActionType,
} from "/src/hooks/use-match-actions/types";
import { MatchAction, MatchActions } from "/src/types/schemas/match-actions";
import { Stopwatch } from "/src/types/schemas/stopwatch";

const MATCH_ACTIONS_REPLICANT_NAME = "match-actions";
const STOPWATCH_REPLICANT_NAME = "stopwatch";

export function scoreboardActions(nodecg: NodeCG.ServerAPI, uuidGenerator: () => string) {
  const actions = nodecg.Replicant<MatchActions>(MATCH_ACTIONS_REPLICANT_NAME, nodecg.bundleName, {
    defaultValue: [] as MatchActions,
    persistent: true,
  });

  // const actions = { value: [] as MatchActions };

  const setActions = (newActions: MatchActions | ((prev: MatchActions) => MatchActions)) => {
    // typeof newActions === typeof Function
    if (typeof newActions === "function") {
      actions.value = newActions(actions.value);
      return;
    }

    actions.value = newActions;
  };

  const addAction = (action: UseMatchActionsAddActionType) => {
    if (action.team === undefined || action.team === null) {
      throw new Error("team is required");
    }

    if (action.action === undefined || action.action === null) {
      throw new Error("action is required");
    }

    const newAction = structuredClone(action) as MatchAction;
    const {
      total = 0,
      offset = 0,
      limit = 0,
      backwards = false,
    } = nodecg.readReplicant<Stopwatch>(STOPWATCH_REPLICANT_NAME, nodecg.bundleName) ?? {};
    const absoluteTime = total || offset;
    let time = absoluteTime;

    if (backwards) {
      time = limit - absoluteTime;
    }

    newAction.id ??= uuidGenerator();
    newAction.matchTime = time;
    newAction.gmtTimestamp = Date.now();

    setActions((prev) => [...prev, newAction]);
  };

  const removeActionById = (id: string) => {
    setActions(actions.value.filter((action) => action.id !== id));
  };

  const removeActionsByTimestamp = (gmtTimestamp: number) => {
    setActions(actions.value.filter((action) => action.gmtTimestamp !== gmtTimestamp));
  };

  const removeActionsByTeam = (team: Team, teamAction?: MatchActionType) => {
    setActions(
      actions.value.filter((action) => {
        if (teamAction) return action.team !== team || (action.team === team && action.action !== teamAction);

        return action.team !== team;
      }),
    );
  };

  const addGoal = (team: Team, goal: GoalActionType = { quantity: 1 }) => {
    addAction({
      action: MatchActionType.GOAL,
      team,
      payload: goal,
    });
  };

  const removeLastGoal = (team: Team) => {
    const goals = actions.value.filter((action) => action.action === MatchActionType.GOAL && action.team === team);

    if (goals.length > 0) {
      removeActionById(goals[goals.length - 1].id);
    }
  };

  // const addWarning = (team: Team, warning: WarningActionType) => {
  //   addAction({
  //     action: "WARNING",
  //     team,
  //     payload: warning,
  //   });
  // };

  const reset = () => {
    setActions([]);
  };

  return {
    addAction,
    removeActionById,
    removeActionsByTimestamp,
    addGoal,
    removeLastGoal,
    removeActionsByTeam,
    // addWarning,
    reset,
  };
}
