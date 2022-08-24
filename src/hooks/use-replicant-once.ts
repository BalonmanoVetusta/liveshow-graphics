// Copied from: https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant-once.ts
import { useRef } from "react";

export type UseReplicantOnceOptions = {
  namespace: string;
};

export const useReplicantOnce = <T>(
  replicantName: string,
  initialValue: T,
  options?: UseReplicantOnceOptions
): T => {
  const state = useRef<T>(initialValue);
  if (options && options.namespace) {
    nodecg.readReplicant<T>(replicantName, options.namespace, (value) => {
      state.current = value;
    });
  } else {
    nodecg.readReplicant<T>(replicantName, (value) => {
      state.current = value;
    });
  }
  return state.current;
};
