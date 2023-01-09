import { motion } from "framer-motion";
import { useMatchActions } from "hooks/use-match-actions";
import { ReactElement } from "react";

export function ScoreboardResults(): ReactElement {
  const { goals } = useMatchActions();
  return (
    <motion.div>
      <motion.span className="local-score-value">
        {goals.local.length.toString().padStart(2, "0")}
      </motion.span>

      <motion.span className="score-separator"> - </motion.span>

      <motion.span className="visitor-score-value">
        {goals.visitor.length.toString().padStart(2, "0")}
      </motion.span>
    </motion.div>
  );
}
