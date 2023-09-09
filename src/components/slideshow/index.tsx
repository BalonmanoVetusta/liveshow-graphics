import { AnimatePresence, motion } from "framer-motion";
import { PropsWithoutRef, cloneElement } from "react";

export declare interface SlideShowProps {
  Item: React.ReactElement;
}

export function SlideShow({ Item, ...props }: PropsWithoutRef<SlideShowProps>) {
  return (
    <AnimatePresence>
      <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}>
        {cloneElement(Item, {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
          ...props,
        })}
      </motion.div>
    </AnimatePresence>
  );
}
