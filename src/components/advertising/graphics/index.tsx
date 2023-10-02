import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";
import { SideFromLeftContainer } from "./side-fron-left-container";
import { useRotation } from "hooks/use-rotation";

function useRotationFromReplicant() {
  const {
    current: initial = 0,
    transition: transitionDuration,
    sleep: timeShowElement,
    setAdvertising,
    ...props
  } = useAdvertisingReplicant();

  return {
    ...props,
    ...useRotation({
      timeShowElement,
      transitionDuration,
      initial,
      onNewIndex: (idx) => setAdvertising({ current: idx }),
    }),
  };
}

export function AdvertisingGraphics() {
  const { ref, show, position = "bottom", maxHeight = "120px" } = useRotationFromReplicant();

  if (!show) return null;

  return (
    <SideFromLeftContainer data-position={position} $maxWidth="100%" $maxHeight={maxHeight} ref={ref}>
      <h1>Advertising Graphics</h1>
      <h1>Another Element as text</h1>
    </SideFromLeftContainer>
  );
}
