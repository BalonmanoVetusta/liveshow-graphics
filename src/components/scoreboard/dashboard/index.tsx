import { GoalsPanel } from "./goals/panel";
import { SunspensionsPanel } from "./suspensions/panel";

export function ScoreboardPanel() {
  return (
    <>
      <GoalsPanel />
      <SunspensionsPanel />
    </>
  );
}
