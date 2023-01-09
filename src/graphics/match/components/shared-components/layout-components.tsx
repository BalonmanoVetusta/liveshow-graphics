import { motion } from "framer-motion";
import styled from "styled-components";

export const Row = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: space-around;
  * {
    max-width: fit-content;
    max-height: fit-content;
  }

  div {
    box-sizing: border-box;
  }
`;

export const Column = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: space-around;
  * {
    max-width: fit-content;
    max-height: fit-content;
  }

  div {
    box-sizing: border-box;
  }
`;
