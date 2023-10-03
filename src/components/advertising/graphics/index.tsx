import { useAssetReplicant } from "hooks/replicants/use-assets-replicant";
import { SideFromLeftContainer } from "./side-fron-left-container";
import { useRotationFromReplicant } from "hooks/use-rotation/use-rotation-from-replicant";

export function AdvertisingGraphics() {
  const { ref, transition } = useRotationFromReplicant();
  const banners = useAssetReplicant("banners");

  return (
    <SideFromLeftContainer $animationDuration={transition} $waitPreviousDissapear={true} ref={ref}>
      {banners.map((banner, index) => (
        <img key={index} src={banner.url} alt={banner.name} />
      ))}
    </SideFromLeftContainer>
  );
}
