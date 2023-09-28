import sharp, { OverlayOptions } from "sharp";
import { positionAreaToBeCentered } from "./position-to-be-centered-coords";
import { resizeToProportional } from "./resize-to-proportional";
import { addTextOnImage } from "./add-text-on-image";

const VISITOR_SHIELD_START_POSITION_COORDINATES: Coordinates2D = [1130, 275];
const CATEGORY_START_POSITION_COORDINATES: Coordinates2D = [637, 270];
const VISITOR_SHIELD_MAX_AREA: Area = [400, 400];
const WEEK_POSITION: Coordinates2D = [30, 820];

export async function composeVetustaThumbnailImage(
  backgroundFilePath,
  shieldFilePath,
  week?: string,
  categoryText?: string,
  fontAsset?: string,
) {
  const shield = sharp(shieldFilePath).trim({ threshold: 0 }).png({ compressionLevel: 0, quality: 100 });
  const { width: originalWidth = 0, height: originalHeight = 0 } = await shield.metadata();

  // Positioning
  const [rescaleWidth, rescaleHeight] = resizeToProportional([originalWidth, originalHeight], VISITOR_SHIELD_MAX_AREA);
  const [x, y] = positionAreaToBeCentered(VISITOR_SHIELD_START_POSITION_COORDINATES, VISITOR_SHIELD_MAX_AREA, [
    rescaleWidth,
    rescaleHeight,
  ]).map(Math.floor);

  let shieldResized;
  if (rescaleWidth !== originalWidth || rescaleHeight !== originalWidth) {
    shieldResized = shield.clone().resize({
      width: rescaleWidth,
      height: rescaleHeight,
    });
  } else {
    shieldResized = shield.clone();
  }

  const layers: Array<OverlayOptions> = [
    {
      input: await shieldResized.toBuffer(),
      left: x,
      top: y,
      density: 72,
    },
  ];

  if (week && week.length > 0) {
    const input = addTextOnImage(`JORNADA ${week.toString().padStart(2, "0")}`, {
      height: 64,
      fontColor: "white",
      anchor: "start",
      fontAsset,
    });
    if (input)
      layers.push({
        input,
        left: WEEK_POSITION[0],
        top: WEEK_POSITION[1],
        density: 72,
      });
  }

  if (categoryText && categoryText.length > 0) {
    const input = addTextOnImage(categoryText, { height: 108, fontColor: "black", anchor: "start", fontAsset });
    if (input)
      layers.push({
        input,
        left: CATEGORY_START_POSITION_COORDINATES[0],
        top: CATEGORY_START_POSITION_COORDINATES[1],
        density: 72,
      });
  }
  return sharp(backgroundFilePath).composite(layers).png({
    compressionLevel: 0,
    quality: 100,
  });
}
