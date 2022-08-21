import { motion } from "framer-motion";
import { useReplicant } from "hooks/use-replicant";
import {
  StopwatchReplicant,
  StopwatchReplicantValue,
} from "hooks/use-stop-watch/use-stopwatch-tick-replicant";
import { ReactElement } from "react";
import { scoreboardMainTimer } from "services/scoreboard-main-timer";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";

interface SeparatorProps {
  char: string;
}

function Separator({ char }: SeparatorProps): ReactElement<SeparatorProps> {
  return <motion.span>{` ${char} `}</motion.span>;
}

export function ScoreBoard(): ReactElement {
  // const {
  //   totalTime,
  //   isRunning,
  //   start,
  //   stop,
  //   reset,
  //   minutes,
  //   seconds,
  //   miliseconds,
  // } = useStopwatchReplicant(STOPWATCH_REPLICANT_NAME, scoreboardMainTimer);
  const [replicant] = useReplicant<StopwatchReplicant, StopwatchReplicant>(
    STOPWATCH_REPLICANT_NAME,
    {} as StopwatchReplicant
  );

  replicant[scoreboardMainTimer] ??= {} as StopwatchReplicantValue;
  const {
    totalTime = 0,
    isRunning = false,
    minutes = 0,
    seconds = 0,
    miliseconds = 0,
  } = replicant[scoreboardMainTimer] ?? {};

  return (
    <motion.div>
      <motion.div className="scoreboardTime">
        <motion.span>{minutes}</motion.span>
        <Separator char=":" />
        <motion.span>
          {seconds}
          <>
            {console.log({
              totalTime,
              isRunning,
              minutes,
              seconds,
              miliseconds,
            })}
          </>
        </motion.span>
      </motion.div>

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
