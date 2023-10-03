import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";
import { useRotation } from "./use-rotation";
import { useEffect } from "react";

export function useRotationFromReplicant() {
  const {
    current: initial = 0,
    transition: transitionDuration,
    sleep: timeShowElement,
    setAdvertising,
    show,
    ...props
  } = useAdvertisingReplicant();
  const { setStart, ...rotation } = useRotation({
    timeShowElement,
    transitionDuration,
    initial,
    initialStart: show,
    onNewIndex: (idx: number) => setAdvertising({ current: idx }),
  });

  useEffect(() => {
    setStart(Boolean(show));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return {
    ...props,
    transition: transitionDuration,
    ...rotation,
  };
}
