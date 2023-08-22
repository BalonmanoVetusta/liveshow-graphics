// Copied from https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant.ts
import type NodeCG from "@nodecg/types";
import structuredClone from "core-js/actual/structured-clone";
import { useEffect, useState } from "react";

type Setter<T = unknown> = (newValue: T | ((prev: T) => T)) => void;

/**
 * Subscribe to a replicant, returns tuple of the replicant value and `setValue` function.
 * The component using this function gets re-rendered when the value is updated.
 * The `setValue` function can be used to update replicant value.
 * @param replicantName The name of the replicant to use
 * @param initialValue Initial value to pass to `useState` function
 * @param options Options object.  Currently supports the optional `namespace` option
 */
export const useReplicant = <T>(
  replicantName: string,
  initialValue: T,
  options?: NodeCG.Replicant.Options<T> & { namespace?: string }
): [T, Setter<T>] => {
  const [value, setValue] = useState<T>(initialValue);

  const replicantOptions =
    options &&
    ({
      persistent: options.persistent,
      schemaPath: options.schemaPath,
    } satisfies typeof options);

  const replicant =
    options && options.namespace
      ? nodecg.Replicant(replicantName, options.namespace, replicantOptions)
      : nodecg.Replicant(replicantName, replicantOptions);

  const changeHandler = (newValue: T): void => {
    setValue((oldValue: T) => {
      if (newValue !== oldValue) {
        return newValue;
      }
      // replicant.value has always the same reference. Cloning to cause re-rendering
      return structuredClone(newValue);
    });
  };

  useEffect(() => {
    if (replicant) {
      replicant.on("change", changeHandler);
    }

    return () => {
      if (replicant) {
        replicant.removeListener("change", changeHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replicant]);

  return [
    value,
    (newValue) => {
      replicant.value =
        newValue instanceof Function ? newValue(value) : newValue;
    },
  ];
};
