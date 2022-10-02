import { Stopwatch } from "types/schemas/stopwatch";

const STOPWATCH_TICK_TIME = 10;

export function stopwatchTickChecks(
  sw: Stopwatch | undefined = undefined,
  tickTime = STOPWATCH_TICK_TIME
) {
  const { offset = 0, startTime = 0, limit = 0, periodTime = 0 } = sw || {};

  const totalTime = startTime > 0 ? offset + Date.now() - startTime : 0;

  const isEnded = limit > 0 && limit - totalTime < tickTime;

  const isRunning = startTime > 0;

  const isEndedPeriod = periodTime > 0 && totalTime % periodTime < tickTime;

  const shouldStop = !isRunning || isEnded || isEndedPeriod;

  return {
    totalTime,
    isEnded,
    isRunning,
    shouldStop,
  };
}
