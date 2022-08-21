import { ReplicantOptions } from "nodecg/types/server";
import useStopwatch from "./use-stopwatch";
import {
  StopwatchReplicant,
  StopwatchReplicantValue,
  useStopwatchTickReplicant,
} from "./use-stopwatch-tick-replicant";

export function useStopwatchReplicant(
  replicantName: string,
  context: string = "stopwatch:default",
  initialValue = {} as StopwatchReplicantValue,
  options: ReplicantOptions<StopwatchReplicant> = {
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
    backwardsMiliseconds: initialValue.backwardsMiliseconds ?? false,
  };
  const stopwatch = useStopwatch({
    onTick,
  });

  return stopwatch;
}
