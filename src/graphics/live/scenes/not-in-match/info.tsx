import { StopwatchTime } from "components/stopwatch";
import { MaxTimeUnit, useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import styled from "styled-components";

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font:
    bolder 68px Cursed Timer ULiL,
    monospace;
  height: fit-content;
  padding: 0;
  margin: 50px 30px;

  & div.time {
  }

  & > h2 {
    color: red;
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

  let title = info ?? "Tiempo Muerto";
  if (!info && minutes === 30 && seconds === 0) {
    title = "Descanso";
  }

  if (!info && minutes === 60) {
    title = "Final del partido";
  }

  return (
    <StyledInfo>
      <h2>{title}</h2>
      <StopwatchTime padZeroes={2} />
    </StyledInfo>
  );
}
