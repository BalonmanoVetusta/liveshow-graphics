import { useReplicant } from "hooks/use-replicant";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { Scenes } from "types/schemas/scenes";
import { Router } from "wouter";
import {
  BaseLocationHook,
  navigate,
  useLocationProperty,
} from "wouter/use-location";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to: string) => navigate("#" + to);

const useHashLocation: BaseLocationHook = () => {
  const location = useLocationProperty(hashLocation) as string;
  return [location, hashNavigate];
};

function _useScene() {
  // Private hook
  const [{ scenes, active = "default" }, setScenes] = useReplicant<Scenes>(
    "scenes",
    {
      active: "default",
      scenes: [],
    }
  );

  const [, goScene] = useHashLocation();

  const registerScene = (name) => {
    setScenes((prevScenes: Scenes) => {
      if (!prevScenes.scenes.includes(name)) {
        prevScenes.scenes!.push(name);
      }

      return prevScenes;
    });
  };

  const unregisterScene = (name) => {
    setScenes((prevScenes: Scenes) => {
      prevScenes.scenes = prevScenes.scenes.filter((scene) => scene !== name);
      return prevScenes;
    });
  };

  useEffect(() => {
    goScene(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return { active, scenes, registerScene, unregisterScene };
}

export type UseScene = ReturnType<typeof _useScene>;

const Context = createContext({} as UseScene);

export default function SceneContextProvider({ children }: PropsWithChildren) {
  return (
    <Context.Provider value={{ ..._useScene() }}>
      <Router hook={useHashLocation}>{children}</Router>
    </Context.Provider>
  );
}

export function useScene(): UseScene {
  const context = useContext<UseScene>(Context);

  if (context === undefined) {
    throw new Error("useScene must be used within a SceneContextProvider");
  }

  return context;
}
