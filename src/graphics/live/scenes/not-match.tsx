import {
  BACKGROUND_COLOR_CSS_VAR,
  BANNER_MAX_HEIGHT_CSS_VAR,
  OFFSET_BOTTOM_CSS_VAR,
  OFFSET_LEFT_CSS_VAR,
  OFFSET_RIGT_CSS_VAR,
  OFFSET_TOP_CSS_VAR,
  useCSSVariables,
} from "hooks/use-css-variables";
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
    setCssVar(BACKGROUND_COLOR_CSS_VAR, "var(--vetusta-yellow, #fede58)");
    setCssVar(BANNER_MAX_HEIGHT_CSS_VAR, "180px");
    setCssVar(OFFSET_TOP_CSS_VAR, "80px");
    setCssVar(OFFSET_BOTTOM_CSS_VAR, "0");
    setCssVar(OFFSET_LEFT_CSS_VAR, "30px");
    setCssVar(OFFSET_RIGT_CSS_VAR, "30px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DivContainer data-position="top left">
        <h2>VETUSTA</h2>
      </DivContainer>
      <DivContainer data-position="top right">
        <h2>VISITANTE</h2>
      </DivContainer>
    </>
  );
}
