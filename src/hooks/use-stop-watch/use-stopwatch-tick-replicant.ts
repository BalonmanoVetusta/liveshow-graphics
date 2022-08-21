import { useReplicant } from "hooks/use-replicant";
import { useReplicantOnce } from "hooks/use-replicant-once";
import { OnTickProps, OnTickType } from "./use-stopwatch";
import { ReplicantOptions } from "/.nodecg/types/server";

export declare interface StopwatchReplicantValue {
  startTime?: number;
  isRunning: boolean;
  totalTime: number;
  hours: number;
  minutes: number;
  seconds: number;
  miliseconds: number;
  limitMiliseconds: number;
  backwardsMiliseconds: boolean;
}

export declare interface StopwatchReplicant {
  [key: string]: StopwatchReplicantValue;
}

export function useStopwatchTickReplicant(
  replicantName: string,
  context: string = "stopwatch:default",
  initialValue: StopwatchReplicantValue = {
    totalTime: 0,
    isRunning: false,
    backwardsMiliseconds: false,
    limitMiliseconds: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    miliseconds: 0,
  },
  options: ReplicantOptions<StopwatchReplicant> = {
    persistent: false,
  },
  bundle: string = "CURR_BNDL"
): [StopwatchReplicant, OnTickType] {
  const [stopwatchReplicant, setStopwatchReplicant] = useReplicant<
    ReplicantOptions<StopwatchReplicant>,
    StopwatchReplicant
  >(replicantName, { [context]: initialValue }, options);

  const initialStopwatchState = useReplicantOnce<StopwatchReplicant>(
    replicantName,
    { [context]: {} as StopwatchReplicantValue },
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
  }: OnTickProps) {
    const prev = JSON.parse(
      JSON.stringify(stopwatchReplicant)
    ) as StopwatchReplicant;

    prev[context] ??= {} as StopwatchReplicantValue;

    if (startTime > 0) {
      prev[context].startTime ??= startTime;
    }

    prev[context] = {
      ...prev[context],
      totalTime,
      isRunning,
      hours,
      minutes,
      seconds,
      miliseconds,
    };

    setStopwatchReplicant(JSON.parse(JSON.stringify(prev)));
  }

  return [initialStopwatchState, onTickReplicant];
}
