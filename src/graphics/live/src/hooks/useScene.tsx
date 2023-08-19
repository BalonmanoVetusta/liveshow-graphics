import { FunctionComponent, ReactElement, useState } from "react";

export declare type Scene = FunctionComponent;

export declare interface Scenes {
  [key: string]: FunctionComponent;
}

export declare interface UseSceneProps {
  scenes: Scenes;
  defaultScene?: FunctionComponent;
}

export declare interface UseScene {
  currentScene: Scene | null;
  getAllScenes: () => Scenes;
  setScene: (scene: Scene | string) => void;
}

function EmptyScene(): ReactElement {
  return <></>;
}

export default function useScene({
  scenes,
  defaultScene = EmptyScene,
}: UseSceneProps): UseScene {
  const [currentScene, setCurrentScene] = useState<Scene>(defaultScene);

  function getAllScenes(): Scenes {
    return scenes;
  }

  function setScene(scene: Scene | string): void {
    if (typeof scene === "string") {
      return setCurrentScene(scenes?.[scene] ?? defaultScene);
    }

    return setCurrentScene(scene);
  }

  return { currentScene, getAllScenes, setScene };
}
