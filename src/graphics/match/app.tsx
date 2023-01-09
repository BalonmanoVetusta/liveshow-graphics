import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useEffect } from "react";
import { SceneInMatch } from "./components/scene-in-match";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "styled-components";
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
      <ThemeProvider
        theme={{
          scoreboardText: {
            fontSize: "48px",
            color: "black",
            fontWeight: "bolder",
          },
          scoreboard: {},
          advertising: {},
        }}
      >
        <SceneInMatch />
      </ThemeProvider>
    </AnimatePresence>
  );
}

export default App;
