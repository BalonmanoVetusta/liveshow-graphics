import { useEffect, useRef, useState } from "react";
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
  setLimitMiliseconds: (timeLimit: number) => void;
  setOffset: (offset: TimeOffset | number) => void;
}

export class StopwatchErrorOnReset extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StopwatchErrorOnReset";
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, StopwatchErrorOnReset.prototype);
  }
}
export class StopwatchErrorWithTimelimit extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StopwatchErrorOnReset";
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, StopwatchErrorWithTimelimit.prototype);
  }
}

export default function useStopwatch({
  initialTime = 0,
  limitMiliseconds: startLimitMiliseconds = 0,
  backwards = false,
  onTick = () => undefined,
}: UseStopwatchProps): UseStopwatchReturn {
  const canTick = useRef<boolean>(false);
  const timer = useRef<number | null>(null);
  const totalOffset = useRef<number>(initialTime);
  const startTime = useRef<number | undefined>(undefined);

  const [totalTime, setTotalTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [limitMiliseconds, setLimitMiliseconds] = useState<number>(
    startLimitMiliseconds
  );
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [miliseconds, setMiliseconds] = useState<number>(0);

  const _callTick = (props: Partial<StopwatchLap> = {}) => {
    const {
      isRunning: isRun = isRunning ?? false,
      totalTime: total = totalTime ?? 0,
      hours: hs = hours ?? 0,
      minutes: mss = minutes ?? 0,
      seconds: ss = seconds ?? 0,
      miliseconds: ms = miliseconds ?? 0,
      startTime: st = startTime.current ?? 0,
      limitMiliseconds: limit = limitMiliseconds ?? 0,
      backwards: isBack = backwards ?? false,
      isEnded: isFinished = isEnded(),
    } = props;

    if (canTick.current) {
      onTick({
        isRunning: isRun,
        totalTime: total,
        hours: hs,
        minutes: mss,
        seconds: ss,
        miliseconds: ms,
        startTime: st,
        limitMiliseconds: limit,
        backwards: isBack,
        isEnded: isFinished,
      });
    }
  };

  const isEnded = () => limitMiliseconds > 0 && totalTime >= limitMiliseconds;

  const stop = () => {
    startTime.current = undefined;
    setIsRunning(false);
    totalOffset.current = totalTime;
  };

  const reset = () => {
    if (isRunning) {
      throw new StopwatchErrorOnReset("Cannot reset while running");
    }
    startTime.current = undefined;
    totalOffset.current = 0;
    setTotalTime(0);
  };

  const start = () => {
    if (limitMiliseconds > 0 && totalTime >= limitMiliseconds) {
      throw new Error("Time limit reached");
    }

    if (!isRunning) {
      canTick.current = true;
      const now = Date.now();
      startTime.current = now;
      setIsRunning(true);
    }
  };

  const setTime = (time: TimeOffset | number): void => {
    if (typeof time === "number") {
      setTotalTime(time);
    } else {
      const { hours = 0, minutes = 0, seconds = 0, miliseconds = 0 } = time;
      let total = 0;
      total += hours * 3600000;
      total += minutes * 60000;
      total += seconds * 1000;
      total += miliseconds;
      setTotalTime(total);
    }

    startTime.current = Date.now();
  };

  // Sums previous offset and new offset
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

    totalOffset.current += total;
  };

  const setNewLimit = (limit: number) => {
    if (limit > totalTime) {
      throw new StopwatchErrorWithTimelimit(
        "New limit must be greater than current time"
      );
    }

    setLimitMiliseconds(limit);
  };

  useEffect(() => {
    const { addEventListener, removeEventListener } =
      globalThis || window || {};

    const listenClose = (event) => {
      _callTick({ isRunning: false });
      canTick.current = false;
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
    addEventListener("beforeunload", listenClose);
    return () => {
      removeEventListener("beforeunload", listenClose);
    };
  }, []);

  useEffect(() => {
    _callTick();
  }, [
    totalTime,
    hours,
    minutes,
    seconds,
    miliseconds,
    isRunning,
    startTime.current,
  ]);

  useEffect(() => {
    const {
      miliseconds: ms = 0,
      seconds: ss = 0,
      minutes: mss = 0,
      hours: hs = 0,
    } = getTimeFromMiliseconds(totalTime);
    setMiliseconds(ms);
    setSeconds(ss);
    setMinutes(mss);
    setHours(hs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTime]);

  useEffect(() => {
    const { setInterval } = window || globalThis || {};
    const currentStartTime = startTime.current ?? 0;
    const internalIsRunning = currentStartTime > 0;
    setIsRunning(internalIsRunning);

    // Running but not timer
    if (internalIsRunning && !timer.current) {
      timer.current = setInterval(() => {
        if (startTime.current) {
          const timeStart = startTime.current ?? 0;
          const offset = totalOffset.current;

          let total = 0;
          if (timeStart > 0) {
            total = Date.now() - timeStart + offset;
          }
          total = isNaN(total) ? 0 : total;

          setTotalTime(total);
        }
      }, STOPWATCH_TICK_MILISECONDS);
    }

    if (!internalIsRunning && timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    if (!internalIsRunning) {
      setIsRunning(false);
      totalOffset.current = totalTime || initialTime || 0;

      _callTick({
        totalTime: totalOffset.current,
      });
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime.current]);

  return {
    start,
    stop,
    reset,
    setTime,
    setOffset,
    setLimitMiliseconds: setNewLimit,
    isRunning,
    totalTime,
    hours,
    minutes,
    seconds,
    miliseconds,
    isEnded: isEnded(),
  };
}
