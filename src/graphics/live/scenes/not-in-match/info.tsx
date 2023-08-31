import { StopwatchTime } from "components/stopwatch";
import { MaxTimeUnit, useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { useMemo } from "react";
import styled from "styled-components";

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font:
    bolder 48px Cursed Timer ULiL,
    monospace;
  height: fit-content;
  padding: 0;
  margin: 50px 30px;

  & div.time {
    font-size: 72px;
  }

  & > h2 {
    color: red;
    font-sixe: 64px;
  }

  & > * {
    padding: 0;
    margin: 0;
  }
`;

export function InfoNotInMatch({ info }: { info?: string }) {
  const {
    minutes = 0,
    seconds = 0,
    // milliseconds = 0,
    // periodTime = 0,
  } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  const title = useMemo(() => {
    if (!!info) return info;

    if (minutes === 0 && seconds === 0) return "COMENZANDO";

    if (minutes === 30 && seconds === 0) return "DESCANSO";

    if (minutes >= 60) return "FINALIZADO";

    return "TIEMPO MUERTO";
  }, [info, minutes, seconds]);

  return (
    <StyledInfo>
      <h2>{title}</h2>
      {minutes === 0 && seconds === 0 ? null : <StopwatchTime padZeroes={2} />}
    </StyledInfo>
  );
}
