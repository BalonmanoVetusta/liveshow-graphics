import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";
import { useRotation } from "./use-rotation";

export function useRotationFromReplicant() {
  const {
    current: initial = 0,
    transition: transitionDuration,
    sleep: timeShowElement,
    setAdvertising,
    ...props
  } = useAdvertisingReplicant();

  return {
    ...props,
    transition: transitionDuration,
    ...useRotation({
      timeShowElement,
      transitionDuration,
      initial,
      onNewIndex: (idx: number) => setAdvertising({ current: idx }),
    }),
  };
}
