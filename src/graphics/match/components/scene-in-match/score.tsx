import { motion } from "framer-motion";
import styled from "styled-components";

// div.scoreboard {
//   background: var(--bg-color-scoreboard, yellow);
//   padding: 20px;
//   border-radius: 25px;
//   border: var(--border-scoreboard, 2px solid black);
//   position: absolute;
//   top: 32px;
//   left: 32px;
//   font-family: "Monospace";
//   font-size: 32px;
//   font-weight: 700;
//   font-variant-numeric: tabular-nums;
//   text-align: center;
//   flex-align: row;
// }

// div.scoreboard img.shield {
//   max-widht: 60px;
//   max-height: 60px;
//   display: inline-block;
//   border-radius: 50px;
// }

// div.scoreboard img.local {
//   position: relative;
//   left: 0;
//   top: 0;
// }

// div.score {
//   flex-direction: row;
//   align-item: center;
//   font-size: 48px;
// }

// div.score > * {
//   display: inline-flex;
// }

// div.separator {
//   margin: 0 16px;
// }

const FlexRow = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 0 16px;

  & > * {
    display: flex;
  }
`;

const Shield = styled(motion.div)`
  max-width: 60px;
  max-height: 60px;
  border-radius: 50px;
  display: inline;
`;
