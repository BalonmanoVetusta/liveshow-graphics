import { SideFromLeftContainer } from "./side-fron-left-container";
import { useRotationFromReplicant } from "hooks/use-rotation/use-rotation-from-replicant";

export function AdvertisingGraphics() {
  const { ref, maxHeight = "120px", transition, show = false } = useRotationFromReplicant();

  if (!show) return null;

  return (
    <SideFromLeftContainer
      $animationDuration={transition}
      $waitPreviousDissapear={true}
      $maxHeight={maxHeight}
      ref={ref}
    >
      <h1>Advertising Graphics</h1>
      <h1>Another Element as text</h1>
    </SideFromLeftContainer>
  );
}
