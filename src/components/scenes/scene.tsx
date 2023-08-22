import { PropsWithChildren } from "react";
import { Route } from "wouter";

export function Scene({ name, children }: PropsWithChildren<{ name: string }>) {
  return <Route path={name}>{children}</Route>;
}
