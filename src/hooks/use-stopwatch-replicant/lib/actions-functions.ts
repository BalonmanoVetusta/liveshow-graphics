import {
  AddOffsetActionType,
  OffsetActionType,
  SetBackwardsActionType,
  StartActionType,
  StopActionType,
  StopwatchActionPayloadType,
  StopwatchActions,
  StopwatchActionType,
  TimeLimitActionType,
  UpdateTimeActionType,
} from "extension/stopwatch-replicant-messages/types";
import { STOPWATCH_MESSAGES_NAME } from "services/stopwatch-messages-name";

function sendStopwatchMessage(
  context: string,
  type: StopwatchActions,
  payload: StopwatchActionPayloadType = undefined
): void | Promise<StopActionType> {
  const { nodecg = undefined } = window || globalThis;
  if (typeof nodecg === typeof undefined) {
    throw new Error("No nodecg found");
  }

  const data: StopwatchActionType = {
    type,
    context,
  };

  if (payload !== undefined) {
    data.payload = payload;
  }

  return nodecg?.sendMessage(STOPWATCH_MESSAGES_NAME, data);
}

export const start = (context: string, payload: StartActionType["payload"]) =>
  sendStopwatchMessage(context, StopwatchActions.START, payload);

export const stop = (context: string) =>
  sendStopwatchMessage(context, StopwatchActions.STOP);

export const reset = (context: string) =>
  sendStopwatchMessage(context, StopwatchActions.RESET);

export const updateTime = (
  context: string,
  payload: UpdateTimeActionType["payload"]
) => sendStopwatchMessage(context, StopwatchActions.UPDATE_TIME, payload);

// time limit
export const setTimeLimit = (
  context: string,
  payload: TimeLimitActionType["payload"]
) => sendStopwatchMessage(context, StopwatchActions.SET_TIME_LIMIT, payload);

// set offset
export const setOffset = (
  context: string,
  payload: OffsetActionType["payload"]
) => sendStopwatchMessage(context, StopwatchActions.SET_OFFSET, payload);

// add offset
export const addOffset = (
  context: string,
  payload: AddOffsetActionType["payload"]
) => sendStopwatchMessage(context, StopwatchActions.ADD_OFFSET, payload);

// set backwards
export const setBackwards = (
  context: string,
  payload: SetBackwardsActionType["payload"]
) => sendStopwatchMessage(context, StopwatchActions.SET_BACKWARDS, payload);
