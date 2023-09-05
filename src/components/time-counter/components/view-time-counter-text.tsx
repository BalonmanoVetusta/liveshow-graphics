import { MaxUnit, useTimeShow } from "../hooks/use-time-show";

type ViewTimeCounterProps = Partial<{
  maxUnit: MaxUnit;
  padWith: string;
  padLength: number;
}> & { name: string };

export function ViewTimeCounterText({
  name,
  maxUnit = MaxUnit.MINUTES,
  padWith = "0",
  padLength = 2,
}: ViewTimeCounterProps) {
  const { days, hours, minutes, seconds, msecs } = useTimeShow({ name, maxUnit, padWith, padLength });

  if (maxUnit === MaxUnit.DAYS) return `${days} days, ${hours}:${minutes}:${seconds}`;
  if (maxUnit === MaxUnit.HOURS) return `${hours}:${minutes}:${seconds}`;
  if (maxUnit === MaxUnit.MINUTES) return `${hours}:${minutes}:${seconds}`;

  if (maxUnit === MaxUnit.SECONDS) return `${seconds}.${msecs}`;

  return `${minutes}:${seconds}`;
}
