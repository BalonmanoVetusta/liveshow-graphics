import { Separator } from "components/separator";
import { motion } from "framer-motion";
import { useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { ReactElement } from "react";

interface StopwatchTimeProps {
  // periodText: string | null;
  // periodMinutes: number; // Must be equal or greater than 1 to be showed
  lastMinuteShowMiliseconds: boolean;
  padZeroes: number;
}

export function StopwatchTime({
  // periodText = null,
  // periodMinutes = 30,
  lastMinuteShowMiliseconds = false,
  padZeroes = 2,
}: Partial<StopwatchTimeProps> = {}): ReactElement {
  const {
    time: totalTime = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
    limit = 0,
    // isEnded = false,
    // isEndOfPeriod = false,
  } = useStopwatchReplicantReader();

  const renderLastMinute = (): ReactElement => {
    if (lastMinuteShowMiliseconds && limit - 60000 <= totalTime) {
      const showMiliseconds = Math.floor(milliseconds / 100)
        .toString()
        .padStart(padZeroes, "0");
      return (
        <motion.div className="last-minute">
          <Separator char="." className="time-separator separator" />
          {showMiliseconds}
        </motion.div>
      );
    }
    return <></>;
  };

  return (
    <motion.div>
      {/* {periodMinutes > 0 ? (
        <motion.div className="period-time">
          {periodText} {minutes > 0 ? Math.ceil(minutes / periodMinutes) : 1}
        </motion.div>
      ) : null} */}

      <motion.div className="scoreboard-time">
        <motion.span>{minutes.toString().padStart(padZeroes, "0")}</motion.span>
        <Separator className="time-separator separator" char=":" />
        <motion.span>{seconds.toString().padStart(padZeroes, "0")}</motion.span>
        {renderLastMinute()}
      </motion.div>
    </motion.div>
  );
}
