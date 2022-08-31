import { useReplicant } from "hooks/use-replicant";
import { Stopwatch } from "types/schemas/stopwatch";

import { MaxTimeUnit } from "hooks/use-stopwatch-replicant/lib/get-time-from-miliseconds";
import { useEffect, useRef, useState } from "react";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";
import {
  getStopwatchTimeValues,
  StopwatchPropsFromLapReturn,
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
}: Partial<UseStopwatchReplicantReaderProps> = {}): StopwatchPropsFromLapReturn {
  const [stopwatch] = useReplicant<Stopwatch, Stopwatch>(
    STOPWATCH_REPLICANT_NAME,
    {
      startTime: 0,
      offset: 0,
      limit: 0,
      backwards: false,
    } as Stopwatch,
    replicantOptions
  );

  const timer = useRef<number | null>(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isBackwards, setIsBackwards] = useState(false);
  const [limit, setLimit] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const {
      startTime = 0,
      limit: swLimit = 0,
      backwards = false,
    } = stopwatch || {};

    if (timer.current === null && (startTime ?? 0) > 0 && !isEnded) {
      timer.current = window.setInterval(() => {
        const props = getStopwatchTimeValues(stopwatch, maxTimeUnit);
        setIsRunning(props.isRunning);
        if (props.isEnded || stopwatch.startTime === 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clearInterval(timer.current!);
        }
        setTime(props.time);
        setDays(props.days ?? 0);
        setHours(props.hours ?? 0);
        setMinutes(props.minutes ?? 0);
        setSeconds(props.seconds ?? 0);
        setMilliseconds(props.milliseconds);
        setIsEnded(props.isEnded);
        setIsBackwards(backwards ?? false);
        setLimit(swLimit ?? 0);
      }, tickTime);
    } else {
      const props = getStopwatchTimeValues(stopwatch, maxTimeUnit);
      setIsRunning(props.isRunning);
      setTime(props.time);
      setDays(props.days ?? 0);
      setHours(props.hours ?? 0);
      setMinutes(props.minutes ?? 0);
      setSeconds(props.seconds ?? 0);
      setMilliseconds(props.milliseconds);
      setIsEnded(props.isEnded);
      setIsBackwards(backwards ?? false);
      setLimit(swLimit ?? 0);
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
    isBackwards,
    limit,
    time,
  };
}
