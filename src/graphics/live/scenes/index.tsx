import { default as EmptyScene } from "./empty-scene";
import { default as InMatchScene } from "./in-match-scene";
import { default as NotInMatch } from "./not-match";

export const registeredScenes = {
  default: EmptyScene,
  "not-in-match": NotInMatch,
  "in-match": InMatchScene,
  "empty-scene": EmptyScene,
};
