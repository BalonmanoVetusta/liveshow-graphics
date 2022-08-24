import { motion } from "framer-motion";
import { useReplicant } from "hooks/use-replicant";
import { ReactElement } from "react";
import { scoreboardMainTimer } from "services/scoreboard-main-timer";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";
import { Stopwatch } from "types/schemas/stopwatch";
import { StopwatchLap } from "types/schemas/stopwatch-lap";

interface SeparatorProps {
  char: string;
}

function Separator({ char }: SeparatorProps): ReactElement<SeparatorProps> {
  return <motion.span>{` ${char} `}</motion.span>;
}

export function ScoreboardResults(): ReactElement {
  const [replicant] = useReplicant<Stopwatch, Stopwatch>(
    STOPWATCH_REPLICANT_NAME,
    {} as Stopwatch
  );

  replicant[scoreboardMainTimer] ??= {} as StopwatchLap;
  const {
    minutes = 0,
    seconds = 0,
    isRunning = false,
    totalTime = 0,
  } = replicant[scoreboardMainTimer];

  return (
    <motion.div>
      <h2>{isRunning ? "IN PROGRESS" : "PAUSED"}</h2>
      <motion.div className="scoreboardTime">
        <motion.span>{minutes}</motion.span>
        <Separator char=":" />
        <motion.span>{seconds}</motion.span>
      </motion.div>

      <div>Total time: {totalTime}</div>

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
