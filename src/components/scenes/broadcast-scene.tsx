import { type ComponentType } from "react";
import { Redirect, Route } from "wouter";
import SceneContextProvider, { useScene } from "./context/scene-context";
import { Scene } from "./scene";

type BroadcastSceneProps = {
  scenes: {
    [key: string]: ComponentType;
  };
};

export function BroadcastScene({ scenes }: BroadcastSceneProps) {
  const { active = "default" } = useScene();

  if (Object.keys(scenes).length === 0) return null;

  return (
    <SceneContextProvider>
      {Object.entries(scenes).map(([name, SceneComponent]) => (
        <Scene key={name} name={name}>
          <SceneComponent />
        </Scene>
      ))}
      <Route>
        <Redirect
          to={active.startsWith("/") ? active : `/${active}`}
          replace={true}
        />
      </Route>
    </SceneContextProvider>
  );
}
