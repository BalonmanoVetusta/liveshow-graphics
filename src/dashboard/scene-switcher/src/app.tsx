import { SceneSelector } from "components/scenes/scene-selector";
import { ReactElement } from "react";

function App(): ReactElement {
  return (
    <>
      <fieldset>
        <SceneSelector />
      </fieldset>
    </>
  );
}

export default App;
