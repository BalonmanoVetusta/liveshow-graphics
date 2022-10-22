import { Instagram, Twitter } from "components/Icons";
import { SocialNetworks } from "components/social-networks";
import { ReactElement } from "react";

const items = [
  {
    Icon: () => <Twitter title="Twitter Vetusta" />,
    text: "@BM_Vetusta",
  },
  {
    Icon: () => <Instagram title="Instagram Vetusta" />,
    text: "@BalonmanoVetusta",
  },
];

export function SceneInMatch(): ReactElement {
  return (
    <>
      <SocialNetworks items={items} />
    </>
  );
}
