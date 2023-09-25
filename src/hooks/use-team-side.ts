import { TeamSide } from "types/schemas/team-side";
import { useReplicant } from "./use-replicant";

export enum TeamSideOptions {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export function useTeamSide() {
  const [{ localTeamSide = TeamSideOptions.LEFT }, setTeamSide] = useReplicant<TeamSide>("team-side", {
    localTeamSide: TeamSideOptions.LEFT,
  });

  const setLocalTeamSide = (newSide: TeamSideOptions | undefined = undefined) => {
    const newLocalTeamSide =
      newSide || localTeamSide === TeamSideOptions.LEFT ? TeamSideOptions.RIGHT : TeamSideOptions.LEFT;
    setTeamSide({
      localTeamSide: newLocalTeamSide,
    });
  };

  return { localTeamSide, setLocalTeamSide, toggleSide: setLocalTeamSide };
}
