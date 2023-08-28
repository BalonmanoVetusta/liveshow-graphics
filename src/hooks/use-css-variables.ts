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

  const getCssVariableFromElement = (cssVariable: string, element: string = ':root', defaultValue?: string) => {
    const el = document.querySelector(element) as HTMLElement;

    return el.style.getPropertyValue(cssVariable) ?? defaultValue;
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

  return { cssVariables, setCssVar, setCssVariables, removeCssVar, getCssVariableFromElement };
}

// Default colors
export const DEFAULT_BG_COLOR = '#0f0';

// Css variables names
export const BACKGROUND_COLOR_CSS_VAR = '--background-color';


