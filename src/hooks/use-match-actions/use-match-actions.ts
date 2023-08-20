import { useReplicant } from "hooks/use-replicant";
import { useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { MatchAction } from "types/schemas/match-action";
import { MatchActions } from "types/schemas/match-actions";
import {
  GoalActionType,
  MatchActionsReplicantOptions,
  MatchActionType,
  MatchSuspensionActionType,
  PlayerInfoSuspensionPayload,
  Team,
  UseMatchActionsAddActionType,
  WarningActionType,
} from "./types";

export const MATCH_ACTIONS_REPLICANT_NAME = "match-actions";

export function useMatchActions(
  initialActions: MatchActions = [],
  options: MatchActionsReplicantOptions = {}
) {
  const { time } = useStopwatchReplicantReader();

  const [actions, setActions] = useReplicant<MatchActions>(
    MATCH_ACTIONS_REPLICANT_NAME,
    initialActions,
    options
  );

  const addAction = (
    action:
      | UseMatchActionsAddActionType
      | MatchAction
      | MatchSuspensionActionType
  ) => {
    if (action.team === undefined || action.team === null) {
      throw new Error("team is required");
    }

    if (action.action === undefined || action.action === null) {
      throw new Error("action is required");
    }

    const newAction = structuredClone(action) as MatchAction;

    newAction.id ??= crypto.randomUUID();
    newAction.matchTime ??= time;
    newAction.gmtTimestamp ??= Date.now();
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
      action: MatchActionType.GOAL,
      team,
      payload: goal,
    });
  };

  const removeLastGoal = (team: Team) => {
    const goals = actions.filter(
      (action) => action.action === MatchActionType.GOAL && action.team === team
    );

    if (goals.length > 0) {
      removeActionById(goals[goals.length - 1].id);
    }
  };

  const addWarning = (team: Team, warning: WarningActionType) => {
    addAction({
      action: MatchActionType.WARNING,
      team,
      payload: warning,
    });
  };

  const startSevenPlayers = (team: Team) => {
    addAction({
      action: MatchActionType.START_SEVEN_PLAYERS,
      team,
    });
  };

  const stopSevenPlayers = (team: Team) => {
    addAction({
      action: MatchActionType.END_SEVEN_PLAYERS,
      team,
    });
  };

  const addSuspension = (
    team: Team,
    suspensionInfo: Partial<PlayerInfoSuspensionPayload> = {}
  ) => {
    suspensionInfo.length ??= 1;
    suspensionInfo.number ??= 0;

    addAction({
      action: MatchActionType.SUSPENSION,
      team,
      payload: suspensionInfo,
    });
  };

  const removeLastAction = (team: Team, action: MatchActionType) => {
    const teamActions = getTeamActions(team, action);

    if (teamActions.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      removeActionById(teamActions.at(-1)!.id);
    }

    return teamActions;
  };

  const getTeamActions = (team: Team, action: MatchActionType) => {
    return actions.filter(
      ({ action: currentAction, team: currentTeam }) =>
        currentAction === action && currentTeam === team
    );
  };

  const resetAllActions = () => {
    setActions([]);
  };

  const getSuspensions = (team: Team, suspensionTime = 120_000) => {
    const suspensions = getTeamActions(team, MatchActionType.SUSPENSION);
    const allPlayersNumbers = suspensions
      .filter(
        (suspension) =>
          ((suspension.payload as PlayerInfoSuspensionPayload).number || 0) > 0
      )
      .map(
        (suspension) =>
          (suspension.payload as PlayerInfoSuspensionPayload).number ?? 0
      );
    const playersNumber = new Set<number>(allPlayersNumbers);

    const playersGroupedSuspensions = Array.from(playersNumber).map(
      (number) => {
        const currentPlayerSuspensions = suspensions
          .filter(
            (suspension) =>
              (suspension.payload as PlayerInfoSuspensionPayload).number ===
              number
          )
          .sort((a, b) => a.matchTime - b.matchTime);

        return currentPlayerSuspensions.reduce((acc, current, index) => {
          const previous = acc.at(-1);

          if (!previous) {
            return acc.push(current);
          }

          const { matchTime: currentMatchTime } = current;
          const { matchTime: previousMatchTime } = previous;

          const previousEndTime = previousMatchTime + suspensionTime;
          const isPreviousEndingBeforeCurrentSuspension =
            currentMatchTime > previousEndTime;

          if (isPreviousEndingBeforeCurrentSuspension) {
            (
              acc[index - 1].payload as PlayerInfoSuspensionPayload
            ).length ??= 1;
            (acc[index - 1].payload as PlayerInfoSuspensionPayload).length += 1;
            return acc;
          }

          return acc.push(current);
        }, [] as MatchActions);
      }
    );

    return playersGroupedSuspensions
      .flat()
      .sort((a: MatchAction, b: MatchAction) => a.matchTime - b.matchTime);
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
    getTeamActions,
    setActions,
    addAction,
    removeActionById,
    removeActionsByTimestamp,
    addGoal,
    removeLastGoal,
    addWarning,
    startSevenPlayers,
    stopSevenPlayers,
    addSuspension,
    getSuspensions,
    removeLastAction,
    resetAllActions,
  };
}
