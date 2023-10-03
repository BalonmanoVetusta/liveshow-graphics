import styled from "styled-components";

// Initial state
export const SideFromLeftContainer = styled.div<
  Partial<{
    $animationDuration: number;
    $waitPreviousDissapear: boolean;
  }>
>`
  & > * {
    object-fit: cover;
    position: absolute;
    left: -110%;
    bottom: 0;
    margin: 0 auto;
    padding: 0;

    min-width: max-content;
    max-width: 100%;
    max-height: var(--banners-max-height, 200px);
    background-color: var(--advertising-background-color, var(--vetusta-new-yellow-color, transparent));

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  & > *.in {
    left: 50%;
    transform: translateX(-50%);
    transition: left ${(props) => props.$animationDuration}s
      ${(props) => (props.$waitPreviousDissapear ? `${props.$animationDuration}s` : null)} linear;
  }
  & > *.out {
    left: 210%;
    transform: translateX(-50%);
    transition: left ${(props) => props.$animationDuration}s linear;
  }
`;
SideFromLeftContainer.defaultProps = {
  $animationDuration: 1,
  $waitPreviousDissapear: true,
};
