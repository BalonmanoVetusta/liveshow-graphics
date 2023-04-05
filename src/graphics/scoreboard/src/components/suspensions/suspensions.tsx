import { useMatchActions } from "hooks/use-match-actions";
import { MatchActionType, Team } from "hooks/use-match-actions/types";
import { useMemo } from "react";
import styled from "styled-components";
import { MatchActions } from "types/schemas/match-actions";
import SuspensionItem from "./suspension-item";

const StyledSuspensionsContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: fit-content;
  height: fit-content;
`;

const StyledSuspensionsList = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  margin: 0 5px;
  padding: 0;
  gap: 5px;
`;

export declare interface SuspensionsProps {
  team: Team;
}

export default function Suspensions({ team }: SuspensionsProps) {
  const { actions } = useMatchActions();

  const teamSuspensionsActions = useMemo<MatchActions>(() => {
    return actions.filter(
      ({ action, team: actionTeam }) =>
        (action === MatchActionType.SUSPENSION ||
          action === MatchActionType.DISQUALIFICATION) &&
        actionTeam === team
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  if (teamSuspensionsActions.length === 0) return <></>;

  return (
    <StyledSuspensionsContainer>
      <StyledSuspensionsList>
        {teamSuspensionsActions.map((action) => (
          <SuspensionItem key={action.id} action={action} />
        ))}
      </StyledSuspensionsList>
    </StyledSuspensionsContainer>
  );
}
