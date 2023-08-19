import { PropsWithChildren, useEffect } from "react";
import { Route } from "wouter";
import { useScene } from "./context/scene-context";

export function Scene({ name, children }: PropsWithChildren<{ name: string }>) {
  const { registerScene, unregisterScene } = useScene();

  useEffect(() => {
    registerScene(name);

    return () => {
      unregisterScene(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Route path={name}>{children}</Route>;
}
