import { Stopwatch } from "types/schemas/stopwatch";

const STOPWATCH_TICK_TIME = 10;

export function stopwatchTickChecks(sw: Stopwatch | undefined = undefined, tickTime = STOPWATCH_TICK_TIME) {
  const { offset = 0, startTime = 0, limit = 0, periodTime = 0 } = sw || {};

  let totalTime = startTime > 0 ? offset + Date.now() - startTime : 0;

  const isEnded = limit > 0 && totalTime >= limit;

  const isRunning = startTime > 0;

  const periodTimeOdd = totalTime % periodTime;
  const isEndedPeriod = periodTime > 0 && periodTimeOdd > 0 && periodTimeOdd < tickTime;
  let currentOrNextPeriod = Math.ceil(totalTime / periodTime);

  const shouldStop = !isRunning || isEnded || isEndedPeriod;

  if (shouldStop) {
    currentOrNextPeriod -= 1;
    totalTime = isEnded ? limit : periodTime * currentOrNextPeriod;
  }

  return {
    currentPeriod: currentOrNextPeriod,
    totalTime,
    isEnded,
    isRunning,
    shouldStop,
  };
}
