import { useReplicant } from "hooks/use-replicant";
import { useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { MatchAction } from "types/schemas/match-action";
import { MatchActions } from "types/schemas/match-actions";
import {
  GoalActionType,
  MatchActionsReplicantOptions,
  MatchActionType,
  Team,
  UseMatchActionsAddActionType,
  WarningActionType,
} from "./types";

const MATCH_ACTIONS_REPLICANT_NAME = "match-actions";

export function useMatchActions(
  initialActions: MatchActions = [],
  options: MatchActionsReplicantOptions = {}
) {
  const { time } = useStopwatchReplicantReader();

  const [actions, setActions] = useReplicant<MatchActions, MatchActions>(
    MATCH_ACTIONS_REPLICANT_NAME,
    initialActions,
    options
  );

  const addAction = (action: UseMatchActionsAddActionType) => {
    if (action.team === undefined || action.team === null) {
      throw new Error("team is required");
    }

    if (action.action === undefined || action.action === null) {
      throw new Error("action is required");
    }

    const newAction = structuredClone(action) as MatchAction;

    newAction.id ??= crypto.randomUUID();
    newAction.matchTime = time;
    newAction.gmtTimestamp = Date.now();
    actions.push(newAction);

    setActions(actions);
  };

  const removeActionById = (id: string) => {
    setActions(actions.filter((action) => action.id !== id));
  };

  const removeActionsByTimestamp = (gmtTimestamp: number) => {
    setActions(
      actions.filter((action) => action.gmtTimestamp !== gmtTimestamp)
    );
  };

  const addGoal = (team: Team, goal: GoalActionType = { quantity: 1 }) => {
    addAction({
      action: "GOAL",
      team,
      payload: goal,
    });
  };

  const removeLastGoal = (team: Team) => {
    const goals = actions.filter(
      (action) => action.action === "GOAL" && action.team === team
    );

    if (goals.length > 0) {
      removeActionById(goals[goals.length - 1].id);
    }
  };

  const addWarning = (team: Team, warning: WarningActionType) => {
    addAction({
      action: "WARNING",
      team,
      payload: warning,
    });
  };

  const startSevenPlayers = (team: Team) => {
    addAction({
      action: "START_SEVEN_PLAYERS",
      team,
    });
  };

  const stopSevenPlayers = (team: Team) => {
    addAction({
      action: "END_SEVEN_PLAYERS",
      team,
    });
  };

  const resetAllActions = () => {
    setActions([]);
  };

  return {
    goals: {
      local: Array.isArray(actions)
        ? actions.filter(
            (action) =>
              action.action === MatchActionType.GOAL &&
              action.team === Team.LOCAL
          )
        : [],
      visitor: Array.isArray(actions)
        ? actions.filter(
            (action) =>
              action.action === MatchActionType.GOAL &&
              action.team === Team.VISITOR
          )
        : [],
    },
    actions,
    setActions,
    addAction,
    removeActionById,
    removeActionsByTimestamp,
    addGoal,
    removeLastGoal,
    addWarning,
    startSevenPlayers,
    stopSevenPlayers,
    reset: resetAllActions,
  };
}
