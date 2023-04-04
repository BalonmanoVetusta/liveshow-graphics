import { AnimatePresence, motion, usePresence } from "framer-motion";
import { useReplicant } from "hooks/use-replicant";
import { useRotationValue } from "hooks/use-rotation-value";
import { PropsWithoutRef, useEffect } from "react";
import { Asset } from "types/Asset";

export declare interface BannersProps {
  duration?: number;
}

const ANIMATION_DURATION = 1;

export function Banners({ duration = 10_000 }: BannersProps) {
  const [banners] = useReplicant<Asset[], Asset[]>("assets:banners", []);
  const { value, isVisible } = useRotationValue(
    duration,
    ANIMATION_DURATION * 1_000,
    true
  );

  if (banners.length === 0) {
    return null;
  }

  const Item = ({ index, ...props }: PropsWithoutRef<{ index: number }>) => {
    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
      !isPresent && setTimeout(safeToRemove, 3000);
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
      <motion.img
        key={banner.sum}
        src={banner.url}
        alt={banner.name}
        initial={{ x: -1920, opacity: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 1920, opacity: 0 }}
        {...props}
      />
    );
  };

  return (
    <AnimatePresence initial={true}>
      {isVisible ? <Item index={value % banners.length} /> : null}
    </AnimatePresence>
  );
}
