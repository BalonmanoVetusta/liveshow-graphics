import { NodeCG } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import { setHandleInterval } from "./handle-interval";
import {
  StopwatchActions,
  StopwatchStartActionTypePayloadObject,
} from "/src/extension/stopwatch-replicant-messages/types";

export default function handleStart(
  nodecg: NodeCG,
  actionType: StopwatchActions,
  currentValue: Stopwatch,
  replicantName: string,
  tickTime: number,
  {
    offset: newOffset = undefined,
    backwards: newBackwards = undefined,
    limit: newLimit = undefined,
    periodTime: newPeriodTime = undefined,
  }: Partial<StopwatchStartActionTypePayloadObject> = {}
) {
  // Set common values between start and reset
  const newValue = {
    offset: newOffset ?? currentValue.offset ?? 0,
    backwards: newBackwards ?? currentValue.backwards ?? false,
    limit: newLimit ?? currentValue.limit ?? 0,
    periodTime: newPeriodTime ?? currentValue.periodTime ?? 0,
  } as Stopwatch;

  // Reset
  if (actionType === StopwatchActions.RESET) {
    newValue.startTime = currentValue.startTime > 0 ? Date.now() : 0;
    newValue.offset = 0;
    newValue.total = 0;
  }

  // Start
  if (actionType === StopwatchActions.START) {
    newValue.startTime = Date.now();
    newValue.offset ??= 0;

    // Set the interval if it was not started
    // This stops the stopwatch automatically
    // at the end of each period

    setHandleInterval(nodecg, replicantName, tickTime);
  }

  return newValue;
}
