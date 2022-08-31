import { motion } from "framer-motion";
import { useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { ReactElement } from "react";

interface SeparatorProps {
  char: string;
}

function Separator({ char }: SeparatorProps): ReactElement<SeparatorProps> {
  return <motion.span>{` ${char} `}</motion.span>;
}

export function ScoreboardResults(): ReactElement {
  const {
    time: totalTime = 0,
    minutes = 0,
    seconds = 0,
    isRunning = false,
    isEnded = false,
  } = useStopwatchReplicantReader();

  return (
    <motion.div>
      <h2>
        {isEnded ? "Horn sound goes here!" : isRunning ? "Playing" : "Paused"}
      </h2>
      <motion.div className="scoreboardTime">
        <motion.span>{minutes}</motion.span>
        <Separator char=":" />
        <motion.span>{seconds}</motion.span>
      </motion.div>
      <motion.small>{Math.floor(totalTime / 1000)} seconds</motion.small>

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
