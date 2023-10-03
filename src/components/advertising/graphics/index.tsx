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
    transition: transitionDuration,
    ...useRotation({
      timeShowElement,
      transitionDuration,
      initial,
      onNewIndex: (idx: number) => setAdvertising({ current: idx }),
    }),
  };
}

export function AdvertisingGraphics() {
  // const { ref, show = true, position = "bottom", maxHeight = "120px", transition } = useRotationFromReplicant();
  const { ref, maxHeight = "120px", transition } = useRotationFromReplicant();

  // if (!show) return null;

  return (
    <SideFromLeftContainer
      $animationDuration={transition}
      $waitPreviousDissapear={true}
      $maxWidth="100%"
      $maxHeight={maxHeight}
      ref={ref}
    >
      <h1>Advertising Graphics</h1>
      <h1>Another Element as text</h1>
    </SideFromLeftContainer>
  );
}
