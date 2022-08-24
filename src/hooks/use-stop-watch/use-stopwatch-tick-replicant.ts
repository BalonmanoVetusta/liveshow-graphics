import { useReplicant } from "hooks/use-replicant";
import { ReplicantOptions } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import { StopwatchLap } from "types/schemas/stopwatch-lap";
import { OnTickFunctionType } from "./use-stopwatch";

type UseStopwatchTickReplicantReturn = [Stopwatch, OnTickFunctionType];

function onTickReplicant(
  context: string,
  setReplicant: (newValue: Stopwatch) => void
): OnTickFunctionType {
  return (lap: StopwatchLap) => {
    setReplicant({ [context]: lap });
  };
}

export function useStopwatchTickReplicant(
  replicantName: string,
  context = "stopwatch:default",
  initialValue = {} as StopwatchLap,
  options: ReplicantOptions<Stopwatch> & { namespace?: string } = {
    persistent: true,
  }
): UseStopwatchTickReplicantReturn {
  const [stopwatchReplicant, setStopwatchReplicant] = useReplicant<
    Stopwatch,
    Stopwatch
  >(replicantName, { [context]: initialValue } as Stopwatch, options);

  return [stopwatchReplicant, onTickReplicant(context, setStopwatchReplicant)];
}
