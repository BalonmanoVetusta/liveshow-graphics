import { useLayoutEffect } from "react";
import { CssVars } from "types/schemas/css-vars";
import { useReplicant } from "./use-replicant";

export declare interface UseCSSVariables {
  cssVariables: CssVars;
  setCssVar: (key: string, value: string) => void;
}

export declare interface UseCSSVariablesOptions {
  cssVariablesToSet?: string[] | string;
  rootElement?: string;
}

export function useCSSVariables({
  cssVariablesToSet,
  rootElement = "body",
}: UseCSSVariablesOptions = {}): UseCSSVariables {
  const [cssVariables, setCssVariables] = useReplicant<CssVars>(
    "css-vars",
    {},
    { persistent: true }
  );

  const setCssVar = (key: string, value: string) => {
    const newCssVariables = structuredClone(cssVariables);
    newCssVariables[key] = value;
    setCssVariables(newCssVariables);
  };

  const _isValidToSet = (key: string) =>
    !cssVariablesToSet || cssVariablesToSet.includes(key);

  useLayoutEffect(() => {
    Object.keys(cssVariables).forEach((key) => {
      if (!_isValidToSet(key)) {
        return;
      }

      const element = document.querySelector(rootElement) as HTMLElement;
      const newValue = cssVariables[key]?.toString();
      const oldValue = element.style.getPropertyValue(key);
      if (newValue !== oldValue && newValue !== undefined) {
        element.style.setProperty(key, newValue);
      }

      if (newValue === undefined) {
        element.style.removeProperty(key);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssVariables]);

  return { cssVariables, setCssVar };
}
