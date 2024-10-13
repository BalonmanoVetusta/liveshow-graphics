import NodeCG from "@nodecg/types";
import { join } from "node:path";
import { composeVetustaThumbnailImage } from "./lib/compose-vetusta-thumbnail-image";

const assetsName = "shields";

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
    nodecg.log.info("Creating the image to view");
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

      composeVetustaThumbnailImage(
        backgroundFilePath,
        join(process.cwd(), decodeURI(asset.url)),
        week.toString(),
        decodeURI(subtitle.toString()),
        `/bundles/${nodecg.bundleName}/assets/fonts/AlumniSans/AlumniSans-Black.ttf`,
      )
        .then((image) => {
          image.toBuffer().then((buffer) => {
            res.type("png");
            res.send(buffer);
          });
        })
        .catch((error) => {
          nodecg.log.error(error);
          throw new Error("500");
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
    nodecg.log.info("Creating the image to download");
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

      composeVetustaThumbnailImage(
        backgroundFilePath,
        join(process.cwd(), decodeURI(asset.url)),
        week.toString(),
        decodeURI(subtitle.toString()),
        `/bundles/${nodecg.bundleName}/assets/fonts/AlumniSans/AlumniSans-Black.ttf`,
      )
        .then((image) => {
          image.toBuffer().then((buffer) => {
            res.setHeader("Content-Type", "application/force-download");
            res.setHeader("Pragma", "public");
            res.setHeader("Expires", 0);
            res.setHeader("Cache-Control", "no-cache,must-revalidate,post-check=0,pre-check=0");
            res.setHeader("Content-Disposition", `attachment;filename=${week.toString().padStart(2, "0")}.png`);
            res.setHeader("Content-Length", buffer.length);
            res.send(buffer);
          });
        })
        .catch((error) => {
          nodecg.log.error(error);
          throw new Error("500");
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
