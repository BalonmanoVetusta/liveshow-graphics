import { motion } from "framer-motion";
import { ReactElement } from "react";
import styled from "styled-components";

const defaultStyledDivProps = {
  fontSize: "36px",
  color: "#151111",
  fontWeight: "bolder",
  font: "",
  fontFamily: "Monospace",
};

declare type StyledDivProps = typeof defaultStyledDivProps;

export const StyledDiv = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;
  ${(props: Partial<StyledDivProps> = defaultStyledDivProps) => `
    font-size: ${props.fontSize};
    color: ${props.color};
    font-weight: ${props.fontWeight};
    font-family: ${props.fontFamily};
    ${props.font ? `font: ${props.font}` : null};
  `}
`;

const defaultTimeProps = {
  ...defaultStyledDivProps,
  minutes: 0,
  seconds: 0,
};

declare type TimeProps = typeof defaultTimeProps & StyledDivProps;

export function Time({
  minutes,
  seconds,
}: Partial<TimeProps> = defaultTimeProps): ReactElement | null {
  return (
    <StyledDiv>
      {minutes}:{seconds}
    </StyledDiv>
  );
}
