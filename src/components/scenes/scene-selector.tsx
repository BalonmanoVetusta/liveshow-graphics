import { useReplicant } from "hooks/use-replicant";
import { useEffect, useState } from "react";
import { Scenes } from "types/schemas/scenes";

function useSceneSwitcher() {
  const [currentScene, setCurrentScene] = useState<string>("default");
  const [scenes, setScenes] = useReplicant<Scenes>("scenes", {
    active: "default",
    scenes: [],
  });

  useEffect(() => {
    setScenes((prev) => {
      prev.active = currentScene;
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

  return { currentScene, setCurrentScene, scenes: scenes.scenes };
}

export function SceneSelector() {
  const {
    currentScene = "default",
    setCurrentScene,
    scenes,
  } = useSceneSwitcher();
  return (
    <select
      onChange={(e) => {
        setCurrentScene(e.target.value);
      }}
      value={currentScene}
    >
      <optgroup label="Scenes">
        {scenes.map((scene) => (
          <option key={scene} value={scene}>
            {scene}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
