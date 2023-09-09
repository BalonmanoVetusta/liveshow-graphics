import { SceneSelector } from "components/scenes/scene-selector";
import { ReactElement } from "react";
import { ConfigureStartTimer } from "./components/configure-start-timer";

function App(): ReactElement {
  return (
    <>
      <SceneSelector />
      <ConfigureStartTimer />
    </>
  );
}

export default App;
