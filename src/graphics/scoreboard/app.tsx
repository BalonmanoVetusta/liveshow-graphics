import { ScoreboardResults } from "graphics/scoreboard/src/components/scoreboard-results";
import { StopwatchTime } from "graphics/scoreboard/src/components/stopwatch-time";
import { ReactElement } from "react";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  return (
    <div>
      {/* <ScoreboardResults stopwatchContext={SCOREBOARD_MAIN_TIMER} /> */}
      <StopwatchTime />
      <ScoreboardResults />
    </div>
  );
}

export default App;
