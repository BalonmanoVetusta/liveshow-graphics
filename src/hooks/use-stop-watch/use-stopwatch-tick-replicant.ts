import { useReplicant } from "hooks/use-replicant";
import { useReplicantOnce } from "hooks/use-replicant-once";
import { Stopwatch } from "types/schemas/stopwatch";
import { StopwatchLap } from "types/schemas/stopwatch-lap";
import { OnTickFunctionType } from "./use-stopwatch";
import { ReplicantOptions } from "/.nodecg/types/server";

export function useStopwatchTickReplicant(
  replicantName: string,
  context: string = "stopwatch:default",
  initialValue: StopwatchLap = {
    totalTime: 0,
    isRunning: false,
    isEnded: false,
    backwards: false,
    limitMiliseconds: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    miliseconds: 0,
  },
  options: ReplicantOptions<Stopwatch> = {
    persistent: false,
  },
  bundle: string = "CURR_BNDL"
): [Stopwatch, OnTickFunctionType] {
  const [stopwatchReplicant, setStopwatchReplicant] = useReplicant<
    ReplicantOptions<Stopwatch>,
    Stopwatch
  >(replicantName, { [context]: initialValue }, options);

  const initialStopwatchState = useReplicantOnce<Stopwatch>(
    replicantName,
    { [context]: {} as StopwatchLap },
    { bundle }
  );

  function onTickReplicant({
    isRunning,
    totalTime,
    hours,
    minutes,
    seconds,
    miliseconds,
    startTime,
    limitMiliseconds,
    backwards,
    isEnded,
  }: StopwatchLap) {
    const prev = JSON.parse(JSON.stringify(stopwatchReplicant)) as Stopwatch;

    prev[context] ??= {} as StopwatchLap;

    if (startTime && startTime > 0) {
      prev[context].startTime ??= startTime;
    }

    prev[context] = {
      ...prev[context],
      isRunning,
      totalTime,
      hours,
      minutes,
      seconds,
      miliseconds,
      startTime,
      limitMiliseconds,
      backwards,
      isEnded,
    };

    setStopwatchReplicant(JSON.parse(JSON.stringify(prev)));
  }

  return [initialStopwatchState, onTickReplicant];
}
