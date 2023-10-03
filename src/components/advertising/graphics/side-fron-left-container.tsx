import styled from "styled-components";

// Initial state
export const SideFromLeftContainer = styled.div<
  Partial<{
    $animationDuration: number;
    $waitPreviousDissapear: boolean;
    $maxWidth: string;
    $maxHeight: string;
  }>
>`
  max-width: 100%;
  & > * {
    max-width: ${(props) => props.$maxWidth};
    max-height: ${(props) => props.$maxHeight};
    object-fit: cover;
    position: absolute;
    left: -110%;
    bottom: 0;
  }
  & > *.in {
    left: 50%;
    transform: translateX(-50%);
    transition: all ${(props) => props.$animationDuration}s
      ${(props) => (props.$waitPreviousDissapear ? `${props.$animationDuration}s` : null)} linear;
  }
  & > *.out {
    left: 210%;
    transform: translateX(-50%);
    transition: all ${(props) => props.$animationDuration}s linear;
  }
`;
SideFromLeftContainer.defaultProps = {
  $animationDuration: 1,
  $waitPreviousDissapear: true,
  $maxWidth: "100%",
  $maxHeight: "auto",
};
