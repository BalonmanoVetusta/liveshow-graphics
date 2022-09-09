import { useReplicant } from "hooks/use-replicant";
import { Stopwatch } from "types/schemas/stopwatch";

import { MaxTimeUnit } from "hooks/use-stopwatch-replicant/lib/get-time-from-miliseconds";
import { useEffect, useRef, useState } from "react";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";
import {
  getStopwatchTimeValues,
  StopwatchPropsReturn,
} from "./lib/get-stopwatch-time-values";
import { ReplicantOptions } from "/.nodecg/types/server";

export interface UseStopwatchReplicantReaderProps {
  replicantOptions: ReplicantOptions<Stopwatch>;
  maxTimeUnit: MaxTimeUnit;
  tickTime: number;
}

// maxTimeUnit is the maximum time unit that will be calculated, e.g.:
// if maxTimeUnit is "seconds" (MaxTimeUnit.SECONDS), then the time will be
// calculated in seconds and miliseconds. This means that minutes, hours and
// days will be 0.
// You still can make your own calculation with "time" which would have the
// total of miliseconds.
export function useStopwatchReplicantReader({
  replicantOptions = { persistent: true },
  maxTimeUnit = MaxTimeUnit.HOURS,
  tickTime = 10,
}: Partial<UseStopwatchReplicantReaderProps> = {}): StopwatchPropsReturn {
  const [stopwatch] = useReplicant<Stopwatch, Stopwatch>(
    STOPWATCH_REPLICANT_NAME,
    {
      startTime: 0,
      offset: 0,
      limit: 0,
      backwards: false,
      periodTime: 0,
    } as Stopwatch,
    replicantOptions
  );

  const timer = useRef<number | null>(null);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [milliseconds, setMilliseconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [isBackwards, setIsBackwards] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [periodTime, setPeriodTime] = useState<number>(0);
  const [currentPeriod, setCurrentPeriod] = useState<number>(0);
  const [totalPeriods, setTotalPeriods] = useState<number>(0);
  const [isEndOfPeriod, setIsEndOfPeriod] = useState<boolean>(false);

  const updateStates = (): void => {
    const currentValues = getStopwatchTimeValues(
      stopwatch,
      maxTimeUnit,
      tickTime
    );

    console.log({ currentValues });

    setTime(currentValues.time);
    setDays(currentValues.days ?? 0);
    setHours(currentValues.hours ?? 0);
    setMinutes(currentValues.minutes ?? 0);
    setSeconds(currentValues.seconds ?? 0);
    setMilliseconds(currentValues.milliseconds);

    if (currentValues.isBackwards !== isBackwards) {
      setIsBackwards(currentValues.isBackwards);
    }

    if (currentValues.limit !== limit) {
      setLimit(currentValues.limit);
    }

    if (currentValues.isRunning !== isRunning) {
      setIsRunning(currentValues.isRunning);
    }

    if (currentValues.isEndOfPeriod !== isEndOfPeriod) {
      setIsEndOfPeriod(currentValues.isEndOfPeriod);
    }

    if (currentValues.isEnded !== isEnded) {
      setIsEnded(currentValues.isEnded);
    }

    if (currentValues.periodTime !== periodTime) {
      setPeriodTime(currentValues.periodTime);
    }

    if (currentValues.currentPeriod !== currentPeriod) {
      setCurrentPeriod(currentValues.currentPeriod ?? 0);
    }

    if (currentValues.totalPeriods !== totalPeriods) {
      setTotalPeriods(currentValues.totalPeriods);
    }
  };

  useEffect(() => {
    const { startTime = 0 } = stopwatch || {};

    if (timer.current === null && (startTime ?? 0) > 0 && !isEnded) {
      timer.current = window.setInterval(() => {
        const props = getStopwatchTimeValues(stopwatch, maxTimeUnit);
        updateStates();
        if (props.isEnded || stopwatch.startTime === 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clearInterval(timer.current!);
        }
      }, tickTime);
    } else {
      updateStates();
    }

    return () => {
      if (timer.current !== null) {
        window.clearInterval(timer.current);
        timer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopwatch]);

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    isRunning,
    isEnded,
    isEndOfPeriod,
    isBackwards,
    limit,
    time,
    periodTime,
    currentPeriod,
    totalPeriods,
  };
}
