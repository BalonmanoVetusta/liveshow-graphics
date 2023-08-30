import type NodeCG from "@nodecg/types";
import * as React from "react";

declare global {
  const nodecg: NodeCG.ClientAPI;
  const NodeCG: NodeCG.ClientAPI;
}

declare module "framer-motion" {
  export interface AnimatePresenceProps {
    children?: React.ReactNode
  }
}
