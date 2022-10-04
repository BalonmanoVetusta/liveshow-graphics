import { NodeCG } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import defaultStopwatchValues from "../../../default-stopwatch-values";
import { stopwatchTickChecks } from "./stopwatch-tick-checks";

// Timer
let timer: NodeJS.Timeout | undefined;

export function setHandleInterval(
  nodecg: NodeCG,
  replicantName: string,
  tickTime: number
): NodeJS.Timeout | null {
  if (!timer) {
    const stopwatch = nodecg.Replicant<Stopwatch>(
      replicantName,
      nodecg.bundleName,
      { defaultValue: defaultStopwatchValues, persistent: true }
    );

    timer = setInterval(() => {
      const stopwwatchCurrentValue = nodecg.readReplicant<Stopwatch>(
        replicantName,
        nodecg.bundleName
      );

      const { totalTime, shouldStop } = stopwatchTickChecks(
        stopwwatchCurrentValue,
        tickTime
      );

      stopwatch.value.total = totalTime >= 0 ? totalTime : 0;

      if (shouldStop) {
        stopwatch.value.offset = totalTime;
        stopwatch.value.startTime = 0;
        stopwatch.value.total = 0;

        if (timer) {
          clearInterval(timer);
        }
        timer = undefined;
      }
    }, tickTime);
  }

  return timer;
}

export function clearHandleInterval() {
  if (timer) {
    clearInterval(timer);
  }
  timer = undefined;

  return timer;
}
