// import { PlayerInfoPayload, Team } from "hooks/use-match-actions/types";
import { BroadcastScene } from "components/scenes/broadcast-scene";
import { ReactElement } from "react";
import scenes from "./scenes";
import { AdvertisingBanners } from "./src/components/advertising-banners";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  return (
    <>
      <BroadcastScene scenes={scenes} />
      <AdvertisingBanners />
    </>
  );
}

export default App;
