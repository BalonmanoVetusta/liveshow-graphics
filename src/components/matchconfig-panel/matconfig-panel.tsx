import { StopwatchTimePanel } from "components/stopwatch-time";
import { ReactElement } from "react";

export function MatchConfigPanel(): ReactElement {
  return (
    <div>
      <p>Config the match time limit</p>
      <StopwatchTimePanel showAddOffset={false} showTime={false} />
    </div>
  );
}
