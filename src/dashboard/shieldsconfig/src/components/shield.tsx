import { UnknownShield } from "components/Icons";
import styled from "styled-components";

const StyledShield = styled.img`
  width: 80px;
`;

export function Shield({
  src,
  ...props
}: { src: string | undefined } & { [key: string]: unknown }) {
  if (!src) {
    return <UnknownShield {...props} />;
  }

  return <StyledShield src={src} {...props} />;
}
