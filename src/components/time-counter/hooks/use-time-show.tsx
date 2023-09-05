import { useEffect, useState } from "react";
import { useTimeCounterReplicant } from "./use-time-counter-replicant";

const MSECONDS_IN_DAY = 86_400_000;
const MSECONDS_IN_HOUR = 3_600_000;
const MSECONDS_IN_MINUTE = 60_000;
const MSECONDS_IN_SEC = 1_000;

export const MaxUnit = {
  DAYS: "DAYS",
  HOURS: "HOURS",
  MINUTES: "MINUTES",
  SECONDS: "SECONDS",
} as const;
export type MaxUnit = keyof typeof MaxUnit;

type UseTimeShowProps = Partial<{
  maxUnit: MaxUnit;
  padWith: string;
  padLength: number;
}> & { name: string };

export function useTimeShow({ name, maxUnit = MaxUnit.MINUTES, padWith = "0", padLength = 2 }: UseTimeShowProps) {
  const [days, setDays] = useState<string>("0");
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("0");
  const [msecs, setMsecs] = useState<string>("0");

  const { time, ...timeCounter } = useTimeCounterReplicant({ name });

  const formatNumber = (n: string | number) => n.toString().padStart(padLength, padWith);

  useEffect(() => {
    let odd = time;
    let isNext = false;
    if (maxUnit === MaxUnit.DAYS) {
      setDays(formatNumber(Math.floor(odd / MSECONDS_IN_DAY)));
      odd %= MSECONDS_IN_DAY;
      isNext = true;
    }

    if (isNext || maxUnit === MaxUnit.HOURS) {
      setHours(formatNumber(Math.floor(odd / MSECONDS_IN_HOUR)));
      odd %= MSECONDS_IN_HOUR;
      isNext = true;
    }

    if (isNext || maxUnit === MaxUnit.MINUTES) {
      setMinutes(formatNumber(Math.floor(odd / MSECONDS_IN_MINUTE)));
      odd %= MSECONDS_IN_MINUTE;
      isNext = true;
    }

    if (isNext || maxUnit === MaxUnit.SECONDS) {
      setSeconds(formatNumber(Math.floor(odd / MSECONDS_IN_SEC)));
      odd %= MSECONDS_IN_SEC;
    }

    setMsecs(formatNumber(odd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return { days, hours, minutes, seconds, msecs, time, ...timeCounter };
}
