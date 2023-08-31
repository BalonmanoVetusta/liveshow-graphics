export enum StopwatchActions {
  START = "START",
  STOP = "STOP",
  RESET = "RESET",
  UPDATE_TIME = "UPDATE_TIME",
  SET_TIME_LIMIT = "SET_TIME_LIMIT",
  SET_OFFSET = "SET_OFFSET",
  ADD_OFFSET = "ADD_OFFSET",
  SET_BACKWARDS = "SET_BACKWARDS",
  SET_PERIOD_TIME = "SET_PERIOD_TIME",
}

export type StopwatchSetTypeByCallback<T> = (
  prev: T,
  startTime: number | undefined,
  limit: number | undefined,
  offset: number | undefined,
) => T;

export interface StopwatchAction {
  type: StopwatchActions;
}

export interface StopwatchStartActionTypePayloadObject {
  offset?: number;
  backwards?: boolean | false;
  limit?: number;
  periodTime?: number;
}

export interface StartActionType extends StopwatchAction {
  type: StopwatchActions.START;
  payload: StopwatchStartActionTypePayloadObject | undefined;
}

export interface StopActionType extends StopwatchAction {
  type: StopwatchActions.STOP;
}

export interface ResetActionType extends StopwatchAction {
  type: StopwatchActions.RESET;
}

export interface UpdateTimeActionType extends StopwatchAction {
  type: StopwatchActions.UPDATE_TIME;
  payload: number | StopwatchSetTypeByCallback<number>;
}

export interface TimeLimitActionType extends StopwatchAction {
  type: StopwatchActions.SET_TIME_LIMIT;
  payload: number | StopwatchSetTypeByCallback<number>;
}

export interface OffsetActionType extends StopwatchAction {
  type: StopwatchActions.SET_OFFSET;
  payload: number | StopwatchSetTypeByCallback<number>;
}

export interface AddOffsetActionType extends StopwatchAction {
  type: StopwatchActions.ADD_OFFSET;
  payload: number;
}

export interface SetBackwardsActionType extends StopwatchAction {
  type: StopwatchActions.SET_BACKWARDS;
  payload: boolean | StopwatchSetTypeByCallback<boolean>;
}

export interface SetPeriodTimeActionType extends StopwatchAction {
  type: StopwatchActions.SET_PERIOD_TIME;
  payload: number | StopwatchSetTypeByCallback<number>;
}

export declare type StopwatchActionPayloadType =
  | StartActionType["payload"]
  | TimeLimitActionType["payload"]
  | UpdateTimeActionType["payload"]
  | OffsetActionType["payload"]
  | AddOffsetActionType["payload"]
  | SetBackwardsActionType["payload"]
  | SetPeriodTimeActionType["payload"]
  | undefined;

export declare type StopwatchActionType = StopwatchAction & {
  payload?: StopwatchActionPayloadType;
};
