import { MaxTimeUnit, useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { ReactElement } from "react";

interface StopwatchTimeProps {
  // showPeriod: boolean;
  // lastMinuteShowMiliseconds: boolean;
  padZeroes: number;
}

export function StopwatchTime({
  // showPeriod = false,
  padZeroes = 0,
}: // lastMinuteShowMiliseconds = false,
Partial<StopwatchTimeProps> = {}): ReactElement {
  const {
    minutes = 0,
    seconds = 0,
    // milliseconds = 0,
    // periodTime = 0,
  } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  return (
    <>
      <div className="time">
        <p>
          {minutes.toString().padStart(padZeroes, "0")}:{seconds.toString().padStart(padZeroes, "0")}
        </p>
      </div>
    </>
  );
}
