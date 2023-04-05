// import { PlayerInfoPayload, Team } from "hooks/use-match-actions/types";
import { ReactElement } from "react";
import { AdvertisingBanners } from "./src/components/advertising-banners";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";
import InMatchScene from "./scenes/in-match-scene";

function App(): ReactElement | null {
  return (
    <>
      <InMatchScene />
      <AdvertisingBanners />
    </>
  );
}

export default App;
