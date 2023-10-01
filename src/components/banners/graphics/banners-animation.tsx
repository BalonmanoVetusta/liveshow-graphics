import { motion, usePresence } from "framer-motion";
import { useRotationValue } from "hooks/use-rotation-value";
import { PropsWithoutRef, useEffect } from "react";
import styled from "styled-components";
import { Asset } from "types/Asset";

export declare interface BannersProps {
  duration?: number;
  animation?: number;
  banners: Asset[];
}

const StyledBanner = styled(motion.img)`
  display: flex;
  max-height: 100%;
  max-width: 100%;
  object-fit: cover;
  margin: 0 auto;
  // min-width: 100%;
  background-color: var(--advertising-background-color, #f9d700);
`;

export function BannersAnimation({ duration = 10, animation = 1, banners }: BannersProps) {
  const { value, isVisible } = useRotationValue(duration * 1_000, animation * 1_000, true);

  if (banners.length === 0) {
    return null;
  }

  const Item = ({ index, ...props }: PropsWithoutRef<{ index: number }>) => {
    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
      !isPresent && setTimeout(safeToRemove, animation * 1_000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent]);

    if (banners.length === 0) {
      return null;
    }

    const banner: Asset | undefined = banners.at(index);
    if (!banner) {
      return null;
    }

    return (
      <>
        <StyledBanner
          key={banner.sum}
          src={banner.url}
          alt={banner.name}
          initial={{ x: -1930 }}
          transition={{ duration: animation }}
          animate={{ x: 0 }}
          exit={{ opacity: 0 }}
          {...props}
        />
      </>
    );
  };

  return <>{isVisible ? <Item index={value % banners.length} key={value % banners.length} /> : null}</>;
}
