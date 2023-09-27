import NodeCG from "@nodecg/types";
import sharp, { OverlayOptions } from "sharp";
import { resizeToProportional } from "./lib/resize-to-proportional";
import { positionAreaToBeCentered } from "./lib/position-to-be-centered-coords";
import { addTextOnImage } from "./lib/add-text-on-image";
import { join } from "node:path";

const assetsName = "shields";
const VISITOR_SHIELD_START_POSITION_COORDINATES: Coordinates2D = [1130, 275];
const CATEGORY_START_POSITION_COORDINATES: Coordinates2D = [639, 275];
const VISITOR_SHIELD_MAX_AREA: Area = [400, 400];
const WEEK_POSITION: Coordinates2D = [30, 820];

async function composeImage(
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
      });
  }

  if (categoryText && categoryText.length > 0) {
    const input = addTextOnImage(categoryText, { height: 108, fontColor: "black", anchor: "start", fontAsset });
    if (input)
      layers.push({
        input,
        left: CATEGORY_START_POSITION_COORDINATES[0],
        top: CATEGORY_START_POSITION_COORDINATES[1],
      });
  }
  return sharp(backgroundFilePath).composite(layers).png({
    compressionLevel: 0,
    quality: 100,
  });
}

export async function createThumnail(nodecg: NodeCG.ServerAPI): Promise<void> {
  nodecg.log.info("Create thumbnail endpoint");
  const router = nodecg.Router();
  const shieldsReplicant = nodecg.Replicant<Array<NodeCG.AssetFile>>(`assets:${assetsName}`, nodecg.bundleName, {});
  let shields: Array<NodeCG.AssetFile> = [];
  const backgroundFilePath = join(process.cwd(), "bundles", nodecg.bundleName, "assets", "images", "background.png");

  shieldsReplicant.on("change", (newValue) => {
    shields = newValue ?? [];
  });

  router.get("/png", async (req, res) => {
    nodecg.log.info("Creating the image");
    const { shield: shieldQuery = "", week = "0", subtitle = "" } = req.query;

    try {
      if (shieldQuery.length === 0) {
        throw new Error("422");
      }

      const asset = shields.find(
        (a: NodeCG.AssetFile) =>
          a.sum === shieldQuery || a.name.toLowerCase().includes(shieldQuery.toString().toLowerCase()),
      );

      if (!asset) throw new Error("404");

      composeImage(
        backgroundFilePath,
        join(process.cwd(), decodeURI(asset.url)),
        week.toString(),
        decodeURI(subtitle.toString()),
        `/${nodecg.bundleName}/assets/fonts/AlumniSans-Bold.ttf`,
      ).then((image) => {
        image.toBuffer().then((buffer) => {
          res.type("png");
          res.send(buffer);
        });
      });
    } catch (error) {
      try {
        const code = parseInt((error as unknown as string).toString());

        res.sendStatus(code);
      } catch (error) {
        // nodecg.log.error(error)
        res.status(500);
      }
    }
  });

  router.get("/png/download", async (req, res) => {
    nodecg.log.info("Creating the image");
    const { shield: shieldQuery = "", week = "0", subtitle = "" } = req.query;

    try {
      if (shieldQuery.length === 0) {
        throw new Error("422");
      }

      const asset = shields.find(
        (a: NodeCG.AssetFile) =>
          a.sum === shieldQuery || a.name.toLowerCase().includes(shieldQuery.toString().toLowerCase()),
      );

      if (!asset) throw new Error("404");

      composeImage(
        backgroundFilePath,
        join(process.cwd(), decodeURI(asset.url)),
        week.toString(),
        decodeURI(subtitle.toString()),
      ).then((image) => {
        image.toBuffer().then((buffer) => {
          res.setHeader("Content-Type", "application/force-download");
          res.setHeader("Pragma", "public");
          res.setHeader("Expires", 0);
          res.setHeader("Cache-Control", "no-cache,must-revalidate,post-check=0,pre-check=0");
          res.setHeader("Content-Disposition", `attachment;filename=${week.toString().padStart(2, "0")}.png`);
          res.setHeader("Content-Length", buffer.length);
          res.send(buffer);
        });
      });
    } catch (error) {
      try {
        const code = parseInt((error as unknown as string).toString());

        res.sendStatus(code);
      } catch (error) {
        // nodecg.log.error(error)
        res.status(500);
      }
    }
  });

  nodecg.mount(`/${nodecg.bundleName}/thumbnail`, router);
}
