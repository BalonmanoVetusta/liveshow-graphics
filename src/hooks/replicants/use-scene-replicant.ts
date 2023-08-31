import { useReplicant } from "hooks/use-replicant";
import { Scenes } from "types/schemas/scenes";

export function useSceneReplicant() {
  const [scenes, setScenes] = useReplicant<Scenes>(
    "scenes",
    {
      active: "default",
      scenes: [],
    } as Scenes,
    {
      persistent: true,
    },
  );

  const setActiveScene = (sceneName: string) => {
    if (!scenes.scenes?.includes(sceneName)) return;

    setScenes((scenes) => ({
      ...scenes,
      active: sceneName,
    }));
  };

  return {
    setActiveScene,
    scenes: scenes.scenes,
    active: scenes.active,
  };
}
