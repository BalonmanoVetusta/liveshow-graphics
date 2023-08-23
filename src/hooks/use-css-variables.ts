import { useLayoutEffect } from "react";
import { CssVars } from "types/schemas/css-vars";
import { useCSSVariablesReplicant } from "./replicants/use-css-variables-replicant";

export interface UseCSSVariablesOptions {
  initialCssVariablesValues?: CssVars;
  cssVariablesToSet?: string[] | string;
  rootElement?: string;
}



export function useCSSVariables({
  initialCssVariablesValues,
  cssVariablesToSet,
  rootElement = ":root",
}: UseCSSVariablesOptions = {}) {
  const { cssVariables, setCssVariables } = useCSSVariablesReplicant(initialCssVariablesValues);

  const setCssVar = (key: string, value: string) => {
    const newCssVariables = structuredClone(cssVariables);
    newCssVariables[key] = value;
    setCssVariables(newCssVariables);
  };

  const removeCssVar = (key: string) => {
    const element = document.querySelector(rootElement) as HTMLElement;
    element.style.removeProperty(key);
  }

  const _isValidToSet = (key: string) =>
    !Boolean(cssVariablesToSet) || cssVariablesToSet?.includes(key);

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

  return { cssVariables, setCssVar, setCssVariables, removeCssVar };
}
