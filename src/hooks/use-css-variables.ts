import { useEffect } from "react";
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
  const { cssVariables, setCssVar, setCssVariables } = useCSSVariablesReplicant(initialCssVariablesValues);

  const removeCssVar = (key: string) => {
    const element = document.querySelector(rootElement) as HTMLElement;
    element.style.removeProperty(key);
  };

  const getCssVariableFromElement = (cssVariable: string, element: string = ":root", defaultValue?: string) => {
    const el = document.querySelector(element) as HTMLElement;

    return el.style.getPropertyValue(cssVariable) ?? defaultValue;
  };

  const _isValidToSet = (key: string) => !Boolean(cssVariablesToSet) || cssVariablesToSet?.includes(key);

  useEffect(() => {
    Object.keys(cssVariables).forEach((key) => {
      if (!_isValidToSet(key)) {
        return;
      }

      const element = document.querySelector(rootElement) as HTMLElement;
      const newValue = cssVariables[key]?.toString();
      const oldValue = element.style.getPropertyValue(key);
      if (newValue !== oldValue && newValue !== undefined) {
        // console.debug('Setting key "%s" with value "%s"', key, newValue);
        element.style.setProperty(key, newValue);
      }

      if (newValue === undefined) {
        // console.debug('Removeing key "%s"', key);
        element.style.removeProperty(key);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssVariables]);

  return { cssVariables, setCssVar, setCssVariables, removeCssVar, getCssVariableFromElement };
}

// Default colors
export const DEFAULT_BG_COLOR = "#00ff00";

// Css variables names
export const BACKGROUND_COLOR_CSS_VAR = "--background-color";

// Advertising
export const BANNER_MAX_HEIGHT_CSS_VAR = "--banners-max-height";

// Offsets
export const OFFSET_CSS_VAR = "--offset";
export const OFFSET_TOP_CSS_VAR = "--offset-top";
export const OFFSET_LEFT_CSS_VAR = "--offset-left";
export const OFFSET_RIGT_CSS_VAR = "--offset-right";
export const OFFSET_BOTTOM_CSS_VAR = "--offset-bottom";
