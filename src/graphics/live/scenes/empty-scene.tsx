import { BACKGROUND_COLOR_CSS_VAR, useCSSVariables } from "hooks/use-css-variables";
import { useEffect } from "react";

export default function EmptyScene() {
  const { setCssVar } = useCSSVariables();

  useEffect(() => {
    setCssVar(BACKGROUND_COLOR_CSS_VAR, "#00ff00");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
