import {
  BACKGROUND_COLOR_CSS_VAR,
  BANNER_MAX_HEIGHT_CSS_VAR,
  OFFSET_BOTTOM_CSS_VAR,
  OFFSET_LEFT_CSS_VAR,
  OFFSET_RIGT_CSS_VAR,
  OFFSET_TOP_CSS_VAR,
  useCSSVariables,
} from "hooks/use-css-variables";
import { Team } from "hooks/use-match-actions/types";
import { useEffect } from "react";
import { InfoNotInMatch } from "./not-in-match/info";
import { TeamNotInMatch } from "./not-in-match/team";

export default function NotInMatch() {
  const { setCssVar } = useCSSVariables();

  useEffect(() => {
    setCssVar(BACKGROUND_COLOR_CSS_VAR, "var(--vetusta-yellow, #fede58)");
    setCssVar(BANNER_MAX_HEIGHT_CSS_VAR, "180px");
    setCssVar(OFFSET_TOP_CSS_VAR, "80px");
    setCssVar(OFFSET_BOTTOM_CSS_VAR, "0");
    setCssVar(OFFSET_LEFT_CSS_VAR, "30px");
    setCssVar(OFFSET_RIGT_CSS_VAR, "30px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TeamNotInMatch team={Team.LOCAL} />
      <InfoNotInMatch />
      <TeamNotInMatch team={Team.VISITOR} />
    </>
  );
}
