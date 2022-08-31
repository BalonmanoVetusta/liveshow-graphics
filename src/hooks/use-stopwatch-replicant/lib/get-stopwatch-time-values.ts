import getTimeFromMiliseconds, {
  MaxTimeUnit,
} from "hooks/use-stopwatch-replicant/lib/get-time-from-miliseconds";
import { Stopwatch } from "types/schemas/stopwatch";

export declare interface StopwatchPropsFromLapReturn {
  time: number;
  limit: number;
  isEnded: boolean;
  isRunning: boolean;
  isBackwards: boolean;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds: number;
}

export function getStopwatchTimeValues(
  sw: Stopwatch,
  maxTimeUnit: MaxTimeUnit = MaxTimeUnit.HOURS
): StopwatchPropsFromLapReturn {
  let totalTime = 0;
  let isRunning = false;
  let isEnded = false;

  const { startTime = 0, offset = 0, limit = 0, backwards = false } = sw;

  if (startTime > 0) {
    totalTime = Date.now() - startTime + offset;
    if (limit > 0 && totalTime >= limit) {
      isRunning = false;
      isEnded = true;
      totalTime = limit;
    } else if (totalTime > 0) {
      isRunning = true;
    } else {
      totalTime = 0;
    }
  } else {
    totalTime = offset;
  }

  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = getTimeFromMiliseconds(totalTime, maxTimeUnit);

  return {
    time: totalTime,
    isRunning,
    isBackwards: backwards,
    isEnded,
    limit,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
