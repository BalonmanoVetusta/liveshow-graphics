import { useEffect, useState } from "react";
import { useTimeCounterReplicant } from "../hooks/use-time-counter-replicant";

const MSECONDS_IN_DAY = 86_400_000;
const MSECONDS_IN_HOUR = 3_600_000;
const MSECONDS_IN_MINUTE = 60_000;
const MSECONDS_IN_SEC = 1_000;

const MaxUnit = {
  DAYS: "DAYS",
  HOURS: "HOURS",
  MINUTES: "MINUTES",
  SECONDS: "SECONDS",
} as const;
type MaxUnit = keyof typeof MaxUnit;

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

  const { time } = useTimeCounterReplicant({ name });

  const formatNumber = (n: string | number) => n.toString().padStart(padLength, padWith);

  useEffect(() => {
    let odd = time;
    if (maxUnit === MaxUnit.DAYS) {
      setDays(formatNumber(Math.floor(odd / MSECONDS_IN_DAY)));
      odd %= MSECONDS_IN_DAY;
    }

    if (maxUnit === MaxUnit.HOURS) {
      setHours(formatNumber(Math.floor(odd / MSECONDS_IN_HOUR)));
      odd %= MSECONDS_IN_HOUR;
    }

    if (maxUnit === MaxUnit.MINUTES) {
      setMinutes(formatNumber(Math.floor(odd / MSECONDS_IN_MINUTE)));
      odd %= MSECONDS_IN_MINUTE;
    }

    setSeconds(formatNumber(Math.floor(odd / MSECONDS_IN_SEC)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return { days, hours, minutes, seconds };
}
