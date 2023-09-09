import { useReplicant } from "hooks/use-replicant";
import { CssVars } from "types/schemas/css-vars";

export function useCSSVariablesReplicant(initialValues?: CssVars) {
  const [cssVariables, setCssVariables] = useReplicant<CssVars>("css-vars", initialValues ?? {}, { persistent: true });

  const setCssVar = (key: string, value: string) => setCssVariables((prev) => ({ ...prev, [key]: value }));
  return { cssVariables, setCssVariables, setCssVar };
}
