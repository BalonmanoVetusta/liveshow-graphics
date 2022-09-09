// startStopwatch
// stopStopwatch
// resetStopwatch
// updateTime
// setTimeLimit
// setOffset
// addOffset
// setBackwards
// useStopwatchReplicant

import {
  AddOffsetActionType,
  OffsetActionType,
  SetBackwardsActionType,
  SetPeriodTimeActionType,
  StartActionType,
  TimeLimitActionType,
  UpdateTimeActionType,
} from "extension/stopwatch-replicant-messages/types";

import {
  addOffset as addOffsetSw,
  reset as resetSw,
  setBackwards as setBackwardsSw,
  setOffset as setOffsetSw,
  setPeriodTime as setPeriodTimeSw,
  setTimeLimit as setTimeLimitSw,
  start as startSw,
  stop as stopSw,
  updateTime as updateTimeSw,
} from "./lib/actions-functions";

interface UseStopwatchReplicantControlReturn {
  start: (payload: StartActionType["payload"]) => void;
  stop: () => void;
  reset: () => void;
  updateTime: (payload: UpdateTimeActionType["payload"]) => void;
  setTimeLimit: (payload: TimeLimitActionType["payload"]) => void;
  setOffset: (payload: OffsetActionType["payload"]) => void;
  addOffset: (payload: AddOffsetActionType["payload"]) => void;
  setBackwards: (payload: SetBackwardsActionType["payload"]) => void;
  setPeriodTime: (payload: SetPeriodTimeActionType["payload"]) => void;
}

export function useStopwatchReplicantControl(): UseStopwatchReplicantControlReturn {
  const start = (payload: StartActionType["payload"] = undefined) =>
    startSw(payload);

  const stop = () => stopSw();

  const reset = () => resetSw();

  const updateTime = (payload: UpdateTimeActionType["payload"]) =>
    updateTimeSw(payload);

  const setTimeLimit = (payload: TimeLimitActionType["payload"]) =>
    setTimeLimitSw(payload);

  const setOffset = (payload: OffsetActionType["payload"]) =>
    setOffsetSw(payload);

  const addOffset = (payload: AddOffsetActionType["payload"]) =>
    addOffsetSw(payload);

  const setBackwards = (
    payload: SetBackwardsActionType["payload"] | undefined = undefined
  ) => setBackwardsSw(payload);

  const setPeriodTime = (payload: SetPeriodTimeActionType["payload"]) =>
    setPeriodTimeSw(payload);

  return {
    start,
    stop,
    reset,
    updateTime,
    setTimeLimit,
    setOffset,
    addOffset,
    setBackwards,
    setPeriodTime,
  };
}
