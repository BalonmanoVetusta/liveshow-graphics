import { AnimatePresence } from "framer-motion";
import { useAssetReplicant } from "hooks/replicants/use-assets-replicant";
import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import styled from "styled-components";
import { BannersAnimation } from "./banners-animation";

const StyledBanners = styled.div`
  opacity: var(--view-banners-opacity, 1);
  overflow: hidden;
  height: var(--banners-max-height, 120px);
  min-width: 100%;
  // background-color: var(--advertising-background-color, #f9d700);
  // border-top: var(--advertising-border-top-color, #151111) 5px solid;
  // border-rigth: var(--advertising-border-top-color, #151111) 5px solid;
  // border-left: var(--advertising-border-top-color, #151111) 5px solid;
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 0 10px 0;
  margin: 0;
`;

export function AdvertisingBanners() {
  const { advertising, advertisingTime } = useGraphicsReplicant();
  const banners = useAssetReplicant("banners");
  if (!advertising || banners.length === 0) return null;

  return (
    <>
      <StyledBanners data-position="bottom center">
        <AnimatePresence initial={true} mode="wait">
          <BannersAnimation duration={advertisingTime} banners={banners} />
        </AnimatePresence>
      </StyledBanners>
    </>
  );
}
