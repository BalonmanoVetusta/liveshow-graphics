import { motion, MotionProps } from "framer-motion";
import { FunctionComponent, ReactElement, useId } from "react";
import styled from "styled-components";

const SocialNetworksBar = styled(motion.div)`
  display: inline-flex;
  margin: 0;
  padding: 2px 24px;
  position: relative;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-color-social-networks, #fede58);
  width: fit-content;
  border-radius: 0 0 64px 64px;
  border: var(--border-social-networks, transparent);
  flex-direction: row;
  align-items: center;
`;

const SocialNetworkItemStyle = styled(motion.div)`
  display: inline-flex;
  margin: 0 8px;
  padding: 0;
  flex-direction: row;
  self-align: center;
  justify-content: center;
  vertical-align: middle;
`;

const SocialNetworkImage = styled.figure`
  display: flex;
  margin: 0;
  padding: 0;
  max-width: 28px;
  max-height: 28px;
  svg {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const SocialNetworkText = styled.p`
  display: flex;
  margin: 0 5px;
  padding: 0;
  font-size: 24px;
  color: var(--text-color-social-networks, #000000);
`;

export declare interface SocialNetworkItemTypeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: FunctionComponent;
  text?: string;
  motionProps?: MotionProps;
}

function SocialNetworkItem({
  Icon = () => <></>,
  text = undefined,
  motionProps = undefined,
}: SocialNetworkItemTypeProps): ReactElement {
  return (
    <SocialNetworkItemStyle {...motionProps}>
      {Icon ? (
        <SocialNetworkImage>
          <Icon />
        </SocialNetworkImage>
      ) : null}
      {text ? <SocialNetworkText>{text}</SocialNetworkText> : null}
    </SocialNetworkItemStyle>
  );
}

export declare interface SocialNetworksProps {
  items: SocialNetworkItemTypeProps[];
}

export function SocialNetworks({ items }: SocialNetworksProps): ReactElement {
  const id = useId();

  return (
    <>
      <SocialNetworksBar>
        {items.map((item, index) => (
          <SocialNetworkItem key={id + index} {...item} />
        ))}
      </SocialNetworksBar>
    </>
  );
}
