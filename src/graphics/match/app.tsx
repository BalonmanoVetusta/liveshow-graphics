import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useEffect } from "react";
import { SceneInMatch } from "./components/scene-in-match";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";
import { AnimatePresence } from "framer-motion";
import { Graphics } from "types/schemas/graphics";

function App(): ReactElement | null {
  const [graphicsConfig] = useReplicant<Graphics, Graphics>(
    "graphics",
    {
      bgColor: "#00ff00",
    } as Graphics,
    {
      persistent: true,
    }
  );

  useEffect(() => {
    const { bgColor = "#00ff00" } = (graphicsConfig as Graphics) || {};
    document.documentElement.style.setProperty("--bg-color", bgColor);
  }, [graphicsConfig]);

  return (
    <AnimatePresence>
      <SceneInMatch />
    </AnimatePresence>
  );
}

export default App;
