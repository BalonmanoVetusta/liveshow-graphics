import { motion } from "framer-motion";

export default function Div() {
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
