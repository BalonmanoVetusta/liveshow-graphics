import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { Team } from "hooks/use-match-actions/types";
import { useId, useMemo } from "react";
export { Team } from "hooks/use-match-actions/types";

type TeamNameInputProps = {
  team: Team;
  onChange?: (newValue: string, previousValue?: string) => void;
};

// const teamNamePropsInGraphicsSchema = {
//   [Team.LOCAL]: "localTeamName",
//   [Team.VISITOR]: "visitorTeamName",
// };

export function TeamNameInput({ team, onChange = () => {} }: TeamNameInputProps) {
  const id = useId();
  const { localTeamName, visitorTeamName, setGraphics } = useGraphicsReplicant();

  const setName = (name: string) => {
    const previous = team === Team.LOCAL ? localTeamName : visitorTeamName;
    onChange?.(name, previous);
    return team === Team.LOCAL ? { localTeamName: name } : { visitorTeamName: name };
  };

  const placeholder = useMemo(() => {
    return team === Team.LOCAL ? "Local Team name..." : "Visitor Team name...";
  }, [team]);

  const value = team === Team.LOCAL ? localTeamName : visitorTeamName;

  return (
    <>
      <input
        type="text"
        name="team-name"
        id={`team-name-${id}`}
        placeholder={placeholder}
        onChange={(event) => {
          event.preventDefault();
          setGraphics(setName(event.target.value));
        }}
        value={value}
      />
    </>
  );
}
