import { ReplicantOptions } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import { StopwatchLap } from "types/schemas/stopwatch-lap";
import useStopwatch from "./use-stopwatch";
import { useStopwatchTickReplicant } from "./use-stopwatch-tick-replicant";

export function useStopwatchReplicant(
  replicantName: string,
  context: string = "stopwatch:default",
  initialValue = {} as StopwatchLap,
  options: ReplicantOptions<Stopwatch> = {
    persistent: true,
  },
  bundle: string = "CURR_BNDL"
) {
  const [replicantValues, onTick] = useStopwatchTickReplicant(
    replicantName,
    context,
    initialValue,
    options,
    bundle
  );

  const stopwatchInitialValues = {
    initialTime: initialValue.totalTime ?? 0,
    limitMiliseconds: initialValue.limitMiliseconds ?? 0,
    backwards: initialValue.backwards ?? false,
  };
  const stopwatch = useStopwatch({
    onTick,
  });

  return stopwatch;
}
