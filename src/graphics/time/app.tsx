import { StopwatchTime } from "graphics/scoreboard/src/components/stopwatch-time";

export function App() {
  return (
    <h1>
      <StopwatchTime padZeroes={2} />
    </h1>
  );
}
