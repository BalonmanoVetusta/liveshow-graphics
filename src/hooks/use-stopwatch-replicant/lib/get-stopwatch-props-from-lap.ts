import getTimeFromMiliseconds, {
  MaxTimeUnit,
} from "lib/get-time-from-miliseconds";
import { StopwatchLap } from "types/schemas/stopwatch";

interface StopwatchPropsFromLapReturn {
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

export function getStopwatchPropsFromLap(
  lap: StopwatchLap
): StopwatchPropsFromLapReturn {
  let totalTime = 0;
  let isRunning = false;
  let isEnded = false;

  const {
    startTime = undefined,
    offset = 0,
    limit = 0,
    backwards = false,
  } = lap;

  if (startTime) {
    isRunning = true;
    totalTime = Date.now() - startTime + offset;
  }

  if (limit > 0 && totalTime >= limit) {
    isRunning = false;
    isEnded = true;
    totalTime = limit;
  }

  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = getTimeFromMiliseconds(totalTime, MaxTimeUnit.HOURS);

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
