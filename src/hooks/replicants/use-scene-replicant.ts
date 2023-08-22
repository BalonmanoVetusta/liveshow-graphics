import { registeredScenes } from "graphics/live/scenes";
import { useReplicant } from "hooks/use-replicant";
import { useLayoutEffect } from "react";
import { Scenes } from "types/schemas/scenes";

const registeredScenesNames = Object.keys(registeredScenes);

export function useSceneReplicant() {
  const [scenes, setScenes] = useReplicant<Scenes>(
    "scenes", {
      active: "default",
      scenes: registeredScenesNames,
    } as Scenes, {
    persistent: true
  });

  useLayoutEffect(() => {
    if (registeredScenesNames.length > 0 && registeredScenesNames.some(s => !scenes.scenes?.includes(s))) {
      setScenes((prev) => ({
        active: prev.active ?? "default",
        scenes: registeredScenesNames
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActiveScene = (sceneName: string) => {
    if (!scenes.scenes?.includes(sceneName)) return;

    setScenes((scenes) => ({
      ...scenes,
      active: sceneName,
    }));
  };

  return {
    setActiveScene, scenes: scenes.scenes, active: scenes.active
  }
}