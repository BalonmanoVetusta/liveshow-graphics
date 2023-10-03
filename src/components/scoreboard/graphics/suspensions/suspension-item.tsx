import { MatchSuspensionActionType } from "hooks/use-match-actions/types";
import { MaxTimeUnit, useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { PropsWithoutRef, useMemo } from "react";
import styled from "styled-components";
import { MatchActionSuspensionTime } from "./group-suspensions-by-time-and-player-number";

const StyledSuspensionItem = styled.li`
  background: var(--suspension-color, red);
  color: var(--suspension-font-color, white);
  border-radius: var(--suspension-border-radius, 8px);
  margin: 0;
  padding: 2px 5px;
  font-size: var(--suspension-font-size, 18px);

  &[data-number]:before {
    content: attr(data-number);
    color: var(--suspension-number-font-color, #cccccc);
    border-radius: 5px;
    padding: 1px 5px;
  }
`;

export declare interface SuspensionItemProps {
  action: MatchActionSuspensionTime;
  suspensionTimeMilliseconds?: number;
}
export default function SuspensionItem({
  action,
  suspensionTimeMilliseconds = 120_000,
  ...props
}: PropsWithoutRef<SuspensionItemProps>) {
  const {
    time,
    // milliseconds = 0,
    // periodTime = 0,
  } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  const { minutes = 0, seconds = 0 } = useMemo(() => {
    const { matchTime } = action;
    const oddTime = matchTime % 1000;
    const exactMatchTime = matchTime - oddTime;
    const calculatedCurrentSuspensionTime = suspensionTimeMilliseconds + 1000 - (time - exactMatchTime); // sum 1000 because the odd time causes to show always 1:59 instead of 2:00 even with stopped time
    const minutes = Math.floor(calculatedCurrentSuspensionTime / 60000);
    const seconds = minutes === 2 || minutes === 4 ? 0 : Math.floor((calculatedCurrentSuspensionTime % 60000) / 1000);

    return {
      minutes,
      seconds,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, suspensionTimeMilliseconds]);

  if (minutes < 0 || seconds < 0) return <></>;
  const { payload } = action as MatchSuspensionActionType;

  if (payload?.number) {
    props["data-number"] = payload.number;
  }

  return (
    <StyledSuspensionItem data-number={payload.number?.toString() ?? ""} {...props}>
      {`${minutes.toString().padStart(1, "0")}:${seconds.toString().padStart(2, "0")}`}
    </StyledSuspensionItem>
  );
}
