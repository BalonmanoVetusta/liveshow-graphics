// import { PlayerInfoPayload, Team } from "hooks/use-match-actions/types";
import { BroadcastScene } from "components/scenes/broadcast-scene";
import { useCSSVariables } from "hooks/use-css-variables";
import { ReactElement } from "react";
import { registeredScenes } from "./scenes";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  useCSSVariables(); // Register custom css variables
  return (
    <>
      <BroadcastScene scenes={registeredScenes} />
    </>
  );
}

export default App;
