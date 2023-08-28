import { NO_SHIELD_URL } from "constants/default-urls";
import { isValidUrl } from "lib/is-valid-url";
import styled from "styled-components";

const StyledShield = styled.img`
  width: 80px;
`;

export function Shield({
  src,
  ...props
}: { src: string | undefined } & { [key: string]: unknown }) {
  const imgUrl = isValidUrl(src) ? src : NO_SHIELD_URL;

  return <StyledShield src={imgUrl} {...props} />;
}
