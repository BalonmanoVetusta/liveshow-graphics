import { useEffect, useState } from "react";
import { StopwatchLap } from "types/schemas/stopwatch-lap";
import getTimeFromMiliseconds from "./lib/get-time-from-miliseconds";

const STOPWATCH_TICK_MILISECONDS = 10;

export declare interface UseStopwatchValues {
  isRunning: boolean;
  isEnded: boolean;
  totalTime: number; // total time if always forward but the calculation can be backwards
  hours: number;
  minutes: number;
  seconds: number;
  miliseconds: number;
}

export type OnTickFunctionType = (props: StopwatchLap) => void;

export declare interface UseStopwatchProps {
  initialTime?: number;
  limitMiliseconds?: number;
  backwards?: boolean;
  onTick?: OnTickFunctionType;
}

export declare interface TimeOffset {
  hours: number;
  minutes: number;
  seconds: number;
  miliseconds: number;
}

export declare interface UseStopwatchReturn extends UseStopwatchValues {
  start: () => void;
  stop: () => void;
  reset: () => void;
  setTime: (time: TimeOffset) => void;
  setOffset: (offset: TimeOffset | number) => void;
}

export default function useStopwatch({
  initialTime = 0,
  limitMiliseconds: startLimitMiliseconds = 0,
  backwards = false,
  onTick = () => {},
}: UseStopwatchProps): UseStopwatchReturn {
  // Interval variable
  let timer: number | null = null;
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [limitMiliseconds, setLimitMiliseconds] = useState<number>(
    startLimitMiliseconds
  );
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState<number | undefined>(undefined); // is running? startTime !== null
  const [totalOffset, setTotalOffset] = useState<number>(initialTime);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [miliseconds, setMiliseconds] = useState<number>(0);

  const isEnded = () => limitMiliseconds > 0 && totalTime >= limitMiliseconds;

  const stop = () => {
    setStartTime(undefined);
    setIsRunning(false);
  };

  const reset = () => {
    if (startTime !== null) {
      setStartTime(Date.now());
    } else {
      stop();
    }
    setTotalTime(0);
  };

  const start = () => {
    if (limitMiliseconds > 0 && totalTime >= limitMiliseconds) {
      throw new Error("Time limit reached");
    }
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
  };

  const setTime = ({
    hours = 0,
    minutes = 0,
    seconds = 0,
    miliseconds = 0,
  }: TimeOffset): void => {
    let total = 0;
    total += hours * 3600000;
    total += minutes * 60000;
    total += seconds * 1000;
    total += miliseconds;

    setTotalTime(total);
  };

  const setOffset = (offset: TimeOffset | number = 0): void => {
    let total = 0;

    if (typeof offset === typeof Number) {
      total = offset as number;
    } else {
      const {
        hours = 0,
        minutes = 0,
        seconds = 0,
        miliseconds = 0,
      } = offset as TimeOffset;
      total += hours * 3600000;
      total += minutes * 60000;
      total += seconds * 1000;
      total += miliseconds;
    }

    setTotalOffset((prev) => prev + total);
  };

  const setNewLimit = (limit: number) => {
    if (limit > totalTime) {
      throw new Error("New limit must be greater than current time");
    }

    setLimitMiliseconds(limit);
  };

  useEffect(() => {
    if (startTime !== undefined && timer === null) {
      const { setInterval } = window || globalThis || {};
      timer = setInterval(() => {
        const totalInMiliseconds = Date.now() - (startTime ?? 0) + totalOffset;
        setTotalTime(totalInMiliseconds);

        // Calculate time from limit to 0
        const calculateTime =
          limitMiliseconds > 0 && backwards
            ? limitMiliseconds - totalInMiliseconds
            : totalInMiliseconds;

        // use short vars because its behind and rename vars
        // to avoid confusion with state vars
        const {
          miliseconds: ms = 0,
          seconds: ss = 0,
          minutes: mss = 0,
          hours: hs = 0,
        } = getTimeFromMiliseconds(calculateTime);

        setHours(hs);
        setMinutes(mss);
        setSeconds(ss);
        setMiliseconds(ms);

        onTick({
          isRunning,
          totalTime: totalInMiliseconds,
          hours: hs,
          minutes: mss,
          seconds: ss,
          miliseconds: ms,
          startTime,
          limitMiliseconds,
          backwards: backwards,
          isEnded: isEnded(),
        });

        if (limitMiliseconds > 0 && miliseconds >= limitMiliseconds) {
          stop();
        }
      }, STOPWATCH_TICK_MILISECONDS);
    }

    // Not sure if this will be called anytime
    if (startTime === null && timer !== null) {
      clearInterval(timer);
    }

    if (startTime === null) {
      setIsRunning(false);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [startTime]);

  useEffect(() => {
    if (totalTime === 0) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setMiliseconds(0);

      return;
    }
  }, [totalTime]);

  return {
    start,
    stop,
    reset,
    setTime,
    setOffset,
    isRunning,
    totalTime,
    hours,
    minutes,
    seconds,
    miliseconds,
    isEnded: isEnded(),
  };
}
