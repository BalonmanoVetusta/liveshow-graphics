import NodeCG from "@nodecg/types";
import { join, basename, dirname } from "node:path";
import { unlinkSync } from "node:fs";
import sharp from "sharp";

const processingImages = {};
const assetCategoriesToConvert = ["shields", "banners"];

export async function convertAssetsToWebp(nodecg: NodeCG.ServerAPI): Promise<void> {
  nodecg.log.info("Convert all image assets to webp automatically");
  async function convertPngToWebp(asset: NodeCG.AssetFile): Promise<void | string> {
    const webpFileName = basename(decodeURI(asset.name), asset.ext).replace(" ", "_").toLowerCase() + ".webp";
    const fullPathCurrentAsset = join(process.cwd(), decodeURI(asset.url));
    const fullPathWebpAsset = join(process.cwd(), dirname(asset.url), webpFileName);

    try {
      nodecg.log.info(`Converting image "${asset.name}" to webp`);
      await sharp(fullPathCurrentAsset)
        .trim({ threshold: 0 })
        .webp({ quality: 100, lossless: true })
        .toFile(fullPathWebpAsset);

      nodecg.log.info(`"${asset.name}" is now "${webpFileName}"`);
      return fullPathCurrentAsset;
    } catch (error) {
      // nodecg.log.error(`Error converting image`);
      // nodecg.log.error(error);
    }
  }

  assetCategoriesToConvert.map((assetsName) => {
    const rep = nodecg.Replicant(`assets:${assetsName}`);
    processingImages[assetsName] ??= false;
    rep.addListener("change", async (newValue: Array<NodeCG.AssetFile> = []) => {
      if (processingImages[assetsName] || newValue.length === 0) return;
      processingImages[assetsName] = true;
      try {
        const deleteFiles: Array<string | void> = await Promise.all(
          newValue
            .filter((a) => a.ext.toLowerCase() !== ".webp" && a.ext.toLowerCase() !== ".svg")
            .map(convertPngToWebp),
        );
        deleteFiles.filter((r) => typeof r === "string").forEach((f: string) => unlinkSync(f));
      } catch (error) {
        // nodecg.log.error(error);
      }
      processingImages[assetsName] = false;
    });
  });
}
