import { GoalsPanel } from "./goals/panel";
import { SunspensionsPanel } from "./suspensions/panel";

export function ScoreboardPanel() {
  return (
    <>
      <h1>Scoreboard Panel</h1>
      <GoalsPanel />
      <SunspensionsPanel />
    </>
  );
}
