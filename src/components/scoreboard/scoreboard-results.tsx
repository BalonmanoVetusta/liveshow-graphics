import { motion } from "framer-motion";
import { ReactElement } from "react";

export function ScoreboardResults(): ReactElement {
  return (
    <motion.div>
      <motion.div className="local-team">
        <motion.div className="local-shield">
          <div className="image">LOCAL LOGO</div>
        </motion.div>
        <motion.div className="local-score">
          <motion.div className="local-score-value">0</motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="visitor-team">
        <motion.div className="visitor-score">
          <motion.div className="visitor-score-value">0</motion.div>
        </motion.div>
        <motion.div className="visitor-shield">
          <div className="image">VISITOR LOGO</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
