import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { useMemo } from "react";
import styled from "styled-components";
import {
  MatchActionSuspensionTime,
  groupSuspensionsByTimeAndPlayerNumber,
} from "./group-suspensions-by-time-and-player-number";
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
  gap: 2px;
`;

export declare interface SuspensionsProps {
  team: Team;
  suspensionTimeMilliseconds?: number;
}

export default function Suspensions({ team, suspensionTimeMilliseconds = 120_000 }: SuspensionsProps) {
  const { actions } = useMatchActions();

  const teamSuspensionsActions = useMemo<Array<MatchActionSuspensionTime>>(() => {
    return groupSuspensionsByTimeAndPlayerNumber(actions, team);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  if (teamSuspensionsActions.length === 0) return <></>;

  return (
    <StyledSuspensionsContainer className="suspensions">
      <StyledSuspensionsList>
        {teamSuspensionsActions.map((action) => {
          const suspensionLength = action.payload?.suspensionLength ?? 1;
          const suspensionTimeInMilliseconds = suspensionLength * suspensionTimeMilliseconds;

          return (
            <SuspensionItem key={action.id} action={action} suspensionTimeMilliseconds={suspensionTimeInMilliseconds} />
          );
        })}
      </StyledSuspensionsList>
    </StyledSuspensionsContainer>
  );
}
