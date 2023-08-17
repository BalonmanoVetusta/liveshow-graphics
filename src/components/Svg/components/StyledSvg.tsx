import styled from "styled-components";

export interface StyledSvgProps {
  $fillValue?: string;
  $strokeValue?: string;
  $shadowValue?: string;
}

export const StyledSvg = styled.svg<StyledSvgProps>`
  ${(props) => {
    props.$fillValue ??= "--svg-color";
    return `
      ${props.$fillValue ? `fill: ${props.$fillValue};` : ""}
      ${props?.$strokeValue ? `stroke: ${props.$strokeValue};` : ""}
      ${props?.$shadowValue ? `filter: ${props.$shadowValue};` : ""}
    `;
  }}
`;
