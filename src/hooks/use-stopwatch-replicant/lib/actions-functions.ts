import {
  AddOffsetActionType,
  OffsetActionType,
  SetBackwardsActionType,
  SetPeriodTimeActionType,
  StartActionType,
  StopActionType,
  StopwatchActionPayloadType,
  StopwatchActions,
  StopwatchActionType,
  TimeLimitActionType,
  UpdateTimeActionType,
} from "/src/extension/stopwatch-replicant-messages/types";

// FIXME: This should not be hardcoded, use service instead or configuration
export const STOPWATCH_MESSAGES_NAME = "stopwatchMessages";

function sendStopwatchMessage(
  type: StopwatchActions,
  payload:
    | StopwatchActionPayloadType
    | Partial<StartActionType["payload"]> = undefined
): void | Promise<StopActionType> {
  const { nodecg = undefined } = window || globalThis;
  if (typeof nodecg === typeof undefined) {
    throw new Error("No nodecg found");
  }

  const data: StopwatchActionType = {
    type,
  };

  if (payload !== undefined) {
    data.payload = payload as StopwatchActionPayloadType;
  }

  return nodecg?.sendMessage(STOPWATCH_MESSAGES_NAME, data);
}

export const start = (
  payload: StartActionType["payload"] | undefined = undefined
) => sendStopwatchMessage(StopwatchActions.START, payload);

export const stop = () => sendStopwatchMessage(StopwatchActions.STOP);

export const reset = (
  payload: Partial<StartActionType["payload"]> = undefined
) => sendStopwatchMessage(StopwatchActions.RESET, payload);

export const updateTime = (payload: UpdateTimeActionType["payload"]) =>
  sendStopwatchMessage(StopwatchActions.UPDATE_TIME, payload);

// time limit
export const setTimeLimit = (payload: TimeLimitActionType["payload"]) =>
  sendStopwatchMessage(StopwatchActions.SET_TIME_LIMIT, payload);

// set offset
export const setOffset = (payload: OffsetActionType["payload"]) =>
  sendStopwatchMessage(StopwatchActions.SET_OFFSET, payload);

// add offset
export const addOffset = (payload: AddOffsetActionType["payload"]) =>
  sendStopwatchMessage(StopwatchActions.ADD_OFFSET, payload);

// set backwards. This function can throw an error if you try to set a backwards (true) without any limit
export const setBackwards = (
  payload: SetBackwardsActionType["payload"] | undefined = undefined
) => sendStopwatchMessage(StopwatchActions.SET_BACKWARDS, payload);

export const setPeriodTime = (payload: SetPeriodTimeActionType["payload"]) => {
  return sendStopwatchMessage(StopwatchActions.SET_PERIOD_TIME, payload);
};
