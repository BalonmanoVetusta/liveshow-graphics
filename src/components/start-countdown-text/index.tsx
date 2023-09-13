import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useEffect, useState } from "react";

export function StartCountdownText({
  notSetText = null,
  padString = "0",
  padLength = 2,
  stripLeadingZero = false,
}: Partial<{
  finishText: "SHOW_HOUR_TEXT" | string;
  notSetText: string | null;
  padString: string;
  padLength: number;
  stripLeadingZero: boolean;
}>) {
  const [interval, setIntervalVar] = useState<ReturnType<typeof setInterval> | null>(null);
  const { startTime = "0", startTimeFinishText = "SHOW_HOUR_TEXT", setGraphics } = useGraphicsReplicant();
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (startTime === "0") return;
    const [h, m] = startTime?.split(":").map((v) => parseInt(v)) ?? [0, 0];
    if (h < 0 || m < 0) setGraphics({ startTime: "0" });
    const now = new Date();
    const finishTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    const countIfShouldStart = finishTime.getTime() - now.getTime();

    if (countIfShouldStart <= 0) {
      setGraphics({ startTime: "0" });
      return;
    }

    setIntervalVar(
      setInterval(() => {
        const current = Date.now();
        const diff = finishTime.getTime() - current;
        if (diff > 0) {
          const calculatedHours = Math.floor(diff / 3_600_000);
          let odd = diff % 3_600_000;
          const calculatedMinutes = Math.floor(odd / 60_000);
          odd = diff % 60_000;
          const calculatedSeconds = Math.floor(odd / 1000);
          setHours(calculatedHours);
          setMinutes(calculatedMinutes);
          setSeconds(calculatedSeconds);
        }

        if (diff <= 0) {
          setIsFinished(true);
          if (interval) clearInterval(interval);
        }
      }, 100),
    );

    setIsFinished(false);

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  useEffect(() => {
    if (isFinished && interval) {
      clearInterval(interval);
      setIntervalVar(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  // Not coundown
  if (startTime === "0" || !startTime) return notSetText;

  const is_all_zero = hours === 0 && minutes === 0 && seconds === 0;

  if (isFinished || (is_all_zero && startTimeFinishText === "SHOW_HOUR_TEXT")) return startTime;
  if (is_all_zero) return startTimeFinishText;

  if (!stripLeadingZero) {
    return (
      <>{`${hours > 0 ? hours.toString().padStart(padLength, padString) + ":" : "00:"}${minutes
        .toString()
        .padStart(padLength, padString)}:${seconds.toString().padStart(padLength, padString)}`}</>
    );
  }

  return (
    <>{`${
      // hours
      hours > 0 ? hours.toString().padStart(padLength, padString) + ":" : ""
    }${
      // minutes
      minutes > 0 ? minutes.toString().padStart(padLength, padString) + ":" : ""
      // seconds
    }${seconds > 0 ? seconds.toString().padStart(padLength, padString) : ""}`}</>
  );
}
