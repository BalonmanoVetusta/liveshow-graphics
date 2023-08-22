// import { PlayerInfoPayload, Team } from "hooks/use-match-actions/types";
import { BroadcastScene } from "components/scenes/broadcast-scene";
import { ReactElement } from "react";
import { AdvertisingBanners } from "../../components/banners/graphics/advertising-banners";
import { registeredScenes } from "./scenes";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  return (
    <>
      <BroadcastScene scenes={registeredScenes} />
      <AdvertisingBanners />
    </>
  );
}

export default App;
