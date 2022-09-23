function getTimeFromMiliseconds(milliseconds, maxUnit = "MINUTES") {
  const result = {};

  if (maxUnit === "MILISECONDS") {
    result.milliseconds = milliseconds;
  }
  result.milliseconds = milliseconds % 1000;

  if (maxUnit === "SECONDS") {
    return { ...result, seconds: Math.floor(milliseconds / 1000) };
  }
  result.seconds = Math.floor(milliseconds / 1000) % 60;

  if (maxUnit === "MINUTES") {
    return { ...result, minutes: Math.floor(milliseconds / 60000) };
  }
  result.minutes = Math.floor(milliseconds / (1000 * 60)) % 60;

  if (maxUnit === "HOURS") {
    return { ...result, hours: Math.floor(milliseconds / 3600000) };
  }
  result.hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
  result.days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  return result;
}

const DEFAULT_STOPWATCH_TICK_TIME = 10;

function getStopwatchTimeValues(
  sw,
  maxTimeUnit = "MINUTES",
  tickTime = DEFAULT_STOPWATCH_TICK_TIME
) {
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
  } = getTimeFromMiliseconds(totalTime || offset, maxTimeUnit);

  const isEnded = limit > 0 && totalTime >= limit;
  const isRunning = !isEnded && totalTime > 0;
  const periodMod = totalTime % periodTime;
  // const isEndOfPeriod =  isEnded || periodTime > 0 && periodMod < tickTime;
  const isEndOfPeriod = isEnded || (periodTime > 0 && periodMod < tickTime);

  return {
    time: totalTime || offset,
    isRunning,
    isBackwards: backwards,
    isEnded,
    isEndOfPeriod,
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

const st = {
  startTime: Date.now() - 60000 - 10,
  offset: 0,
  limit: 120000,
  backwards: false,
  periodTime: 60000,
};

// st.startTime = Date.now() - 120000;

const props = getStopwatchTimeValues(st);
console.log(props);
