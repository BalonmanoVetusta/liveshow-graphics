import { getTimeFromMiliseconds, MaxTimeUnit } from "hooks/use-stop-watch";
import { Fragment, ReactElement, useId } from "react";

enum STOPWATCH_TIME_SHOW {
  MILISECONDS_ON_LAST_MINUTE = 0,
  MILISECONDS = 5,
  SECONDS = 10,
  MINUTES = 15,
  HOURS = 20,
  // DAYS = 25,
}

interface StopwatchTimeProps {
  time: number;
  timeLimit: number;
  backwardsTime: boolean;
  view: Array<STOPWATCH_TIME_SHOW>;
  fixedDigits: number;
  showZeroValues: boolean;
  separator: string;
}

function Separator({ separator }: { separator: string }): ReactElement {
  return <span className="separator">{separator}</span>;
}

export default function StopwatchTime({
  time = 0,
  timeLimit = 0,
  view = [
    STOPWATCH_TIME_SHOW.MINUTES,
    STOPWATCH_TIME_SHOW.SECONDS,
    STOPWATCH_TIME_SHOW.MILISECONDS_ON_LAST_MINUTE,
  ],
  fixedDigits = 2,
  showZeroValues = true,
  separator = " : ",
}: StopwatchTimeProps): ReactElement {
  const id = useId();
  const maxViewValue = Math.max(...view);
  let maxConvertTime: MaxTimeUnit = MaxTimeUnit.MILISECONDS;

  switch (maxViewValue) {
    case STOPWATCH_TIME_SHOW.HOURS:
      maxConvertTime = MaxTimeUnit.HOURS;
      break;
    case STOPWATCH_TIME_SHOW.MINUTES:
      maxConvertTime = MaxTimeUnit.MINUTES;
      break;
    case STOPWATCH_TIME_SHOW.SECONDS:
      maxConvertTime = MaxTimeUnit.SECONDS;
      break;
    // case STOPWATCH_TIME_SHOW.DAYS:
    //   maxConvertTime = MaxTimeUnit.DAYS;
    //   break;
    default:
      maxConvertTime = MaxTimeUnit.MILISECONDS;
      break;
  }

  const convertedTime = getTimeFromMiliseconds(time, maxConvertTime);

  const timeKeys = Object.keys(convertedTime);
  const renderTime = timeKeys.map((key, index) => {
    const time = convertedTime[key];
    if (time === 0 && !showZeroValues) {
      return null;
    }
    const isLast = index === timeKeys.length - 1;

    return (
      <Fragment key={`${id}-${key}-${index}`}>
        <span key={`${id}-${key}-${index}`} className={key}>
          {convertedTime[key].toString().padStart(fixedDigits, "0")}
        </span>
        {!isLast ? <Separator separator={separator} /> : null}
      </Fragment>
    );
  });

  const lastMinuteTime = timeLimit - 60_000;
  const isLastMinuteAndShowMiliseconds =
    STOPWATCH_TIME_SHOW.MILISECONDS_ON_LAST_MINUTE in view &&
    !(STOPWATCH_TIME_SHOW.MILISECONDS in view) &&
    timeLimit > 0 &&
    time >= lastMinuteTime;

  return (
    <div>
      {renderTime}

      {isLastMinuteAndShowMiliseconds ? (
        <Fragment>
          <Separator separator="." />
        </Fragment>
      ) : null}
    </div>
  );
}
