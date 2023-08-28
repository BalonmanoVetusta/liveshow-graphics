import { BACKGROUND_COLOR_CSS_VAR, useCSSVariables } from "hooks/use-css-variables";
import { useEffect } from "react";
import styled from "styled-components";

const DivContainer = styled.div`
  width: 200px;
  height: 300px;
  background-color: purple;
`;

export default function NotInMatch() {
  const { setCssVar } = useCSSVariables();

  useEffect(() => {
    setCssVar(BACKGROUND_COLOR_CSS_VAR, 'var(--vetusta-yellow, #fede58)')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DivContainer data-position="middle left"><h2>VETUSTA</h2></DivContainer>
      <DivContainer data-position="middle right"><h2>VISITANTE</h2></DivContainer>
    </>
  );
}
