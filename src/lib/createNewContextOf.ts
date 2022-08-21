// import useCtx from "hooks/useCtx";
import { createContext, useContext } from "react";

export default function createNewContextOf<A extends {} | null>(
  defaultState: A | undefined = undefined
) {
  const Ctx = createContext<A | undefined>(defaultState);

  function useCtx() {
    const c = useContext(Ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }

  return [useCtx, Ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}
