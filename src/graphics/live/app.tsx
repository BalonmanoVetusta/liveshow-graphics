// import { PlayerInfoPayload, Team } from "hooks/use-match-action
import { BroadcastScene } from "components/scenes/broadcast-scene";
import { useCSSVariables } from "hooks/use-css-variables";
import { ReactElement } from "react";
import { registeredScenes } from "./scenes";
import { AdvertisingGraphics } from "components/advertising/graphics";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  useCSSVariables(); // Register custom css variables
  return (
    <>
      <BroadcastScene scenes={registeredScenes} />
      <AdvertisingGraphics />
    </>
  );
}

export default App;
