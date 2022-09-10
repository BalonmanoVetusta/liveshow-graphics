import { useReplicant } from "hooks/use-replicant";
import { ReplicantOptions } from "nodecg/types/server";
import { MatchAction } from "types/schemas/match-action";
import { MatchActions } from "types/schemas/match-actions";

export enum MatchActionType {
  GOAL = "GOAL",
  TIMEOUT = "TIMEOUT",
  WARNING = "WARNING",
  MATCH_START = "MATCH_START",
  MATCH_END = "MATCH_END",
  OTHER = "OTHER",
}

export enum Team {
  LOCAL = "LOCAL",
  VISITOR = "VISITOR",
}

export enum AttackPosition {
  GOALKEEPER = "GOALKEEPER", // Because can score goals
  LW = "LEFT_WING",
  LHB = "LEFT_HALF_BACK",
  PM = "PLAYMAKER",
  RHB = "RIGHT_HALF_BACK",
  RW = "RIGHT_WING",
  PI = "PIVOT",
  SPI = "SECOND_PIVOT",
  LP = "LEFT_PIVOT",
  RP = "RIGHT_PIVOT",
}

export interface GoalActionType {
  player?: number;
  distance?: 6 | 9 | 7;
  assist?: number;
  quantity: number;
  position?: AttackPosition;
}

export enum WarningType {
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  BLUE_CARD = "BLUE_CARD",
  OTHER_COLOR_CARD = "OTHER_COLOR_CARD",
  TIME_SUSPENSION = "TIME_SUSPENSION",
}

export interface WarningActionType {
  player: number | "COACH" | "SECOND_COACH" | "OFFICIAL" | "OTHER" | "UNKNOWN";
  type: WarningType;
}

export type MatchActionsReplicantOptions = ReplicantOptions<MatchActions> & {
  namespace?: string;
};

export type UseMatchActionsMatchActionType = Omit<MatchAction, "gmtTimestamp">;
export type UseMatchActionsAddActionType = Omit<
  MatchAction,
  "gmtTimestamp" | "id"
>;

export interface UseMatchActionsReturn extends MatchActions {
  goals: { local: MatchAction[]; visitor: MatchAction[] };
  setActions: (actions: MatchActions) => void;
  addAction: (matchTime: number, action: MatchAction) => void;
  removeActionById: (id: string) => void;
  removeActionsByTimestamp: (timestamp: number) => void;
  addGoal: (matchTime: number, goal: GoalActionType) => void;
  addWarning: (matchTime: number, warning: WarningActionType) => void;
}

export function useMatchActions(
  initialActions: MatchActions = [],
  options: MatchActionsReplicantOptions = {}
) {
  const [actions, setActions] = useReplicant<MatchActions, MatchActions>(
    "match-actions",
    initialActions,
    options
  );

  const addAction = (
    matchTime: number,
    action: UseMatchActionsAddActionType
  ) => {
    if (action.matchTime === undefined || action.matchTime === null) {
      throw new Error("matchTime is required");
    }

    if (action.team === undefined || action.team === null) {
      throw new Error("team is required");
    }

    if (action.action === undefined || action.action === null) {
      throw new Error("action is required");
    }

    const newActions = [...actions];
    const newAction = action as MatchAction;

    newAction.gmtTimestamp = Date.now();
    newActions.push(newAction);

    setActions(newActions);
  };

  const removeActionById = (id: string) => {
    setActions([...actions.filter((action) => action.id !== id)]);
  };

  const removeActionsByTimestamp = (gmtTimestamp: number) => {
    setActions([
      ...actions.filter((action) => action.gmtTimestamp !== gmtTimestamp),
    ]);
  };

  const addGoal = (
    matchTime: number,
    team: Team,
    goal: GoalActionType = { quantity: 1 }
  ) => {
    addAction(matchTime, {
      action: "GOAL",
      matchTime,
      team,
      payload: goal,
    });
  };

  const addWarning = (
    matchTime: number,
    team: Team,
    warning: WarningActionType
  ) => {
    addAction(matchTime, {
      action: "WARNING",
      matchTime,
      team,
      payload: warning,
    });
  };

  return {
    goals: {
      local: [...actions].filter(
        (action) =>
          action.action === MatchActionType.GOAL && action.team === Team.LOCAL
      ),
      visitor: [...actions].filter(
        (action) =>
          action.action === MatchActionType.GOAL && action.team === Team.VISITOR
      ),
    },
    actions,
    setActions,
    addAction,
    removeActionById,
    removeActionsByTimestamp,
    addGoal,
    addWarning,
  };
}
