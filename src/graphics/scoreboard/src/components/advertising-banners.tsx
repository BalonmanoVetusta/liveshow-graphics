import { Banners } from "components/banners";
import { useReplicant } from "hooks/use-replicant";
import { Graphics } from "types/schemas/graphics";

const GRAPHICS_REPLICANT_NAME = "graphics";

export function AdvertisingBanners() {
  const [graphics] = useReplicant<Graphics, Graphics>(GRAPHICS_REPLICANT_NAME, {
    advertising: true,
    advertisingTime: 10,
  });

  return (
    <>
      {graphics.advertising ? (
        <div data-position="bottom center" className="banners">
          <Banners duration={graphics?.advertisingTime ?? 10000} />
        </div>
      ) : null}
    </>
  );
}
