import { useSceneReplicant } from "hooks/replicants/use-scene-replicant";
import { useEffect, type ComponentType } from "react";
import { Redirect, Route, Router } from "wouter";
import { BaseLocationHook, navigate, useLocationProperty } from "wouter/use-location";
import { Scene } from "./scene";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to: string) => navigate("#" + to);

const useHashLocation: BaseLocationHook = () => {
  const location = useLocationProperty(hashLocation) as string;
  return [location, hashNavigate];
};

type BroadcastSceneProps = {
  scenes: {
    [key: string]: ComponentType;
  };
};

export function BroadcastScene({ scenes }: BroadcastSceneProps) {
  const { active } = useSceneReplicant();

  useEffect(() => {
    hashNavigate(active);
  }, [active]);

  return (
    <Router hook={useHashLocation}>
      {Object.entries(scenes).map(([name, SceneComponent]) => (
        <Scene key={name} name={name}>
          <SceneComponent />
        </Scene>
      ))}
      <Route>
        <Redirect to={active} replace={true} />
      </Route>
    </Router>
  );
}
