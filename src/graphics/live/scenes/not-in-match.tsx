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
import { useStopwatchReplicantControl } from "hooks/use-stopwatch-replicant";

export default function NotInMatch() {
  const { setCssVariables } = useCSSVariables();
  const { stop } = useStopwatchReplicantControl();

  useEffect(() => {
    stop();
    setCssVariables((prev) => ({
      ...prev,
      [BACKGROUND_COLOR_CSS_VAR]: "var(--vetusta-yellow, #fede58)",
      [BANNER_MAX_HEIGHT_CSS_VAR]: "200px",
      [OFFSET_TOP_CSS_VAR]: "120px",
      [OFFSET_BOTTOM_CSS_VAR]: "0",
      [OFFSET_LEFT_CSS_VAR]: "30px",
      [OFFSET_RIGT_CSS_VAR]: "30px",
    }));
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
