import getTimeFromMiliseconds, {
  MaxTimeUnit,
} from "hooks/use-stopwatch-replicant/lib/get-time-from-miliseconds";
import { Stopwatch } from "types/schemas/stopwatch";

const DEFAULT_STOPWATCH_TICK_TIME = 10;

export declare interface StopwatchPropsReturn {
  time: number;
  limit: number;
  isEnded: boolean;
  isRunning: boolean;
  isEndOfPeriod: boolean;
  isBackwards: boolean;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds: number;
  periodTime: number;
  currentPeriod: number;
  totalPeriods: number;
}

export function getStopwatchTimeValues(
  sw: Stopwatch,
  maxTimeUnit: MaxTimeUnit = MaxTimeUnit.HOURS,
  tickTime = DEFAULT_STOPWATCH_TICK_TIME
): StopwatchPropsReturn {
  let totalTime = 0;

  const {
    startTime = 0,
    offset = 0,
    limit = 0,
    backwards = false,
    periodTime = 0,
  } = sw;

  if (startTime > 0) {
    totalTime = Date.now() - startTime + offset;
    if (totalTime < 0) {
      throw new Error("Time is negative and can not be negative.");
    }

    if (limit > 0 && totalTime >= limit) {
      totalTime = limit;
    }
  }

  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = getTimeFromMiliseconds(totalTime, maxTimeUnit);

  const isRunning = totalTime > 0;
  const isEnded =
    limit > 0 &&
    !isRunning &&
    (totalTime >= limit || totalTime - limit < tickTime);
  return {
    time: totalTime || offset,
    isRunning,
    isBackwards: backwards,
    isEnded,
    isEndOfPeriod:
      isEnded || (periodTime > 0 && totalTime % periodTime < tickTime),
    limit,
    hours,
    minutes,
    seconds,
    milliseconds,
    periodTime: sw.periodTime,
    currentPeriod:
      periodTime > 0 ? Math.max(Math.ceil(totalTime / periodTime), 1) : 0,
    totalPeriods:
      limit > 0 && periodTime > 0 ? Math.ceil(limit / periodTime) : 0,
  };
}
