import { useAssetReplicant } from "hooks/replicants/use-assets-replicant";
import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { BannersAnimation } from "./banners-animation";

export function AdvertisingBanners() {
  const { advertising, advertisingTime } = useGraphicsReplicant();
  const banners = useAssetReplicant("banners");
  if (!advertising || banners.length === 0) return null;

  return (
    <>
      <div data-position="bottom center" className="banners">
        <BannersAnimation duration={advertisingTime} banners={banners} />
      </div>
    </>
  );
}
