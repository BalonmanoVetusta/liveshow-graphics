import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function Div(props: PropsWithChildren<object>) {
  return (
    <motion.div
      onDrag={(event, info) => {
        console.log(info.point.x);
      }}
    >
      Draggable div
    </motion.div>
  );
}
