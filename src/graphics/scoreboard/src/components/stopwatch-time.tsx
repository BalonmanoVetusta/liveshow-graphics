import {
  MaxTimeUnit,
  useStopwatchReplicantReader,
} from "hooks/use-stopwatch-replicant";
import { ReactElement } from "react";

interface StopwatchTimeProps {
  // periodText: string | null;
  // periodMinutes: number; // Must be equal or greater than 1 to be showed
  // lastMinuteShowMiliseconds: boolean;
  padZeroes: number;
}

export function StopwatchTime({
  // periodText = null,
  padZeroes = 2,
}: Partial<StopwatchTimeProps> = {}): ReactElement {
  const { minutes = 0, seconds = 0 } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  return (
    <>
      {minutes.toString().padStart(padZeroes, "0")}:
      {seconds.toString().padStart(padZeroes, "0")}
    </>
  );
}
