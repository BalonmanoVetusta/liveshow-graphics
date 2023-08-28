import { useReplicant } from "hooks/use-replicant";
import { useEffect } from "react";
import { Scenes } from "types/schemas/scenes";


export function useSceneReplicant() {
  const [scenes, setScenes] = useReplicant<Scenes>(
    "scenes", {
      active: "default",
      scenes: [],
    } as Scenes, {
    persistent: true
  });

  useEffect(() => {
    console.log('Scenes have changed');
    console.log({ scenes: scenes.scenes, active: scenes.active });
  }, [scenes])

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