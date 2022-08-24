import { ReplicantOptions } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import { StopwatchLap } from "types/schemas/stopwatch-lap";
import useStopwatch, { UseStopwatchReturn } from "./use-stopwatch";
import { useStopwatchTickReplicant } from "./use-stopwatch-tick-replicant";

export function useStopwatchReplicant(
  replicantName: string,
  context = "stopwatch:default",
  initialValue = {} as StopwatchLap,
  options: ReplicantOptions<Stopwatch> & { namespace?: string } = {
    persistent: true,
  }
): UseStopwatchReturn {
  const [replicantValues, onTick] = useStopwatchTickReplicant(
    replicantName,
    context,
    initialValue,
    options
  );

  const stopwatch = useStopwatch({
    initialTime: replicantValues[context].totalTime,
    limitMiliseconds: replicantValues[context].limitMiliseconds,
    backwards: replicantValues[context].backwards,
    onTick,
  });

  return stopwatch;
}
