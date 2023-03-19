import { PlayerInfoPayload } from "hooks/use-match-actions/types";
import {
  MaxTimeUnit,
  useStopwatchReplicantReader,
} from "hooks/use-stopwatch-replicant";
import { ReactElement, useMemo } from "react";
import { MatchAction } from "types/schemas/match-action";

interface SuspensionTimeProps {
  action: MatchAction;
  suspensionTimeMilliseconds?: number;
}

export function SuspensionTime({
  action,
  suspensionTimeMilliseconds = 120_000,
}: SuspensionTimeProps): ReactElement {
  const payload = action.payload as PlayerInfoPayload;
  const {
    time,
    // milliseconds = 0,
    // periodTime = 0,
  } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  const { minutes = 0, seconds = 0 } = useMemo(() => {
    const { matchTime } = action;
    const calculatedCurrentSuspensionTime =
      suspensionTimeMilliseconds - (time - matchTime);
    const minutes = Math.floor(calculatedCurrentSuspensionTime / 60000);
    const seconds = Math.floor(
      (calculatedCurrentSuspensionTime % 60000) / 1000
    );

    return {
      minutes,
      seconds,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  if (minutes < 0 || seconds < 0) return <></>;

  return (
    <>
      <li data-number={payload.number?.toString() ?? ""}>{`${minutes
        .toString()
        .padStart(1, "0")}:${seconds.toString().padStart(2, "0")}`}</li>
    </>
  );
}
