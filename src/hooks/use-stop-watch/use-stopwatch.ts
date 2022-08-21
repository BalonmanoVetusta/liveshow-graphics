import { useEffect, useState } from "react";
import getTimeFromMiliseconds from "./lib/get-time-from-miliseconds";

const STOPWATCH_TICK_MILISECONDS = 10;

export declare interface UseStopwatchValues {
  isRunning: boolean;
  totalTime: number;
  hours: number;
  minutes: number;
  seconds: number;
  miliseconds: number;
}

export declare interface OnTickProps extends UseStopwatchValues {
  startTime: number;
  limitMiliseconds: number;
  backwardsMiliseconds: boolean;
}

export type OnTickType = (props: OnTickProps) => void;

export declare interface useStopwatchProps {
  initialTime?: number;
  limitMiliseconds?: number;
  backwardsMiliseconds?: boolean;
  onTick?: OnTickType;
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
  backwardsMiliseconds = false,
  onTick = () => {},
}: useStopwatchProps): UseStopwatchReturn {
  // Interval variable
  let timer: number | null = null;
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [limitMiliseconds, setLimitMiliseconds] = useState<number>(
    startLimitMiliseconds
  );
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null); // is running? startTime !== null
  const [totalOffset, setTotalOffset] = useState<number>(initialTime);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [miliseconds, setMiliseconds] = useState<number>(0);

  const stop = () => {
    setStartTime(null);
    setIsRunning(false);
  };

  const reset = () => {
    if (startTime !== null) {
      setStartTime(Date.now());
    } else {
      stop();
      setStartTime(null);
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
    if (startTime !== null && timer === null) {
      const { setInterval } = window || globalThis || {};
      timer = setInterval(() => {
        const miliseconds = Date.now() - startTime + totalOffset;
        setTotalTime(miliseconds);
        onTick({
          isRunning,
          totalTime,
          hours,
          minutes,
          seconds,
          miliseconds,
          startTime,
          limitMiliseconds: limitMiliseconds,
          backwardsMiliseconds,
        });

        if (limitMiliseconds > 0 && miliseconds >= limitMiliseconds) {
          stop();
        }
      }, STOPWATCH_TICK_MILISECONDS);
    }

    // Not sure if this will be called anytime
    // if (startTime === null && timer !== null) {
    //   clearInterval(timer);
    // }

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

    // Calculate time from limit to 0
    const calculateTime =
      limitMiliseconds > 0 && backwardsMiliseconds
        ? limitMiliseconds - totalTime
        : totalTime;

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
  };
}
