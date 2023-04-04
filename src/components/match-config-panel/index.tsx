import { StopwatchDashboard } from "components/stopwatch";
import { ReactElement } from "react";

export function MatchConfigPanel(): ReactElement {
  return (
    <div>
      <p>Config the match time limit</p>
      <StopwatchDashboard showAddOffset={false} showTime={false} />
    </div>
  );
}
