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
  StartActionType,
  TimeLimitActionType,
  UpdateTimeActionType,
} from "extension/stopwatch-replicant-messages/types";
import { useReplicant } from "hooks/use-replicant";
import { Stopwatch, StopwatchLap } from "types/schemas/stopwatch";

import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";
import {
  reset as resetSw,
  start as startSw,
  stop as stopSw,
  updateTime as updateTimeSw,
  setTimeLimit as setTimeLimitSw,
  setOffset as setOffsetSw,
  addOffset as addOffsetSw,
  setBackwards as setBackwardsSw,
} from "./lib/actions-functions";
import { ReplicantOptions } from "/.nodecg/types/server";

interface UseStopwatchReplicantProps {
  context: string;
  replicantOptions?: ReplicantOptions<Stopwatch>;
}

interface UseStopwatchReplicantReturn extends StopwatchLap {
  start: (payload: StartActionType["payload"]) => void;
  stop: () => void;
  reset: () => void;
  updateTime: (payload: UpdateTimeActionType["payload"]) => void;
  setTimeLimit: (payload: TimeLimitActionType["payload"]) => void;
  setOffset: (payload: OffsetActionType["payload"]) => void;
  addOffset: (payload: AddOffsetActionType["payload"]) => void;
  setBackwards: (payload: SetBackwardsActionType["payload"]) => void;
}

export function useStopwatchReplicant({
  context = "stopwatch:default",
  replicantOptions = { persistent: true },
}: UseStopwatchReplicantProps): UseStopwatchReplicantReturn {
  const [stopwatch] = useReplicant<Stopwatch, Stopwatch>(
    STOPWATCH_REPLICANT_NAME,
    {
      [context]: {
        startTime: 0,
        offset: 0,
        limit: 0,
        backwards: false,
      },
    } as Stopwatch,
    replicantOptions
  );

  const start = (payload: StartActionType["payload"]) =>
    startSw(context, payload);

  const stop = () => stopSw(context);

  const reset = () => resetSw(context);

  const updateTime = (payload: UpdateTimeActionType["payload"]) =>
    updateTimeSw(context, payload);

  const setTimeLimit = (payload: TimeLimitActionType["payload"]) =>
    setTimeLimitSw(context, payload);

  const setOffset = (payload: OffsetActionType["payload"]) =>
    setOffsetSw(context, payload);

  const addOffset = (payload: AddOffsetActionType["payload"]) =>
    addOffsetSw(context, payload);

  const setBackwards = (
    payload: SetBackwardsActionType["payload"] | undefined = undefined
  ) =>
    payload
      ? setBackwardsSw(context, payload)
      : setBackwardsSw(context, (prev) => !prev);

  return {
    ...stopwatch[context],
    start,
    stop,
    reset,
    updateTime,
    setTimeLimit,
    setOffset,
    addOffset,
    setBackwards,
  };
}
