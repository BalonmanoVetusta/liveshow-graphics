import { ScoreboardResults } from "components/scoreboard/scoreboard-results";
import { ReactElement } from "react";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  return (
    <div>
      {/* <ScoreboardResults stopwatchContext={SCOREBOARD_MAIN_TIMER} /> */}
      <ScoreboardResults />
    </div>
  );
}

export default App;
