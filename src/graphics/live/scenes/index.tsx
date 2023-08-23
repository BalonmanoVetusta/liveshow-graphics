import { EmptyScene } from "./empty-scene";
import { InMatchScene } from "./in-match-scene";
import { NotInMatch } from "./not-match";

export const registeredScenes = {
  default: EmptyScene,
  "not-in-match": NotInMatch,
  "in-match": InMatchScene,
  "empty-scene": EmptyScene,
};
