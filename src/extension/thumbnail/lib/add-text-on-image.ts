type Baseline =
  | "auto"
  | "text-bottom"
  | "alphabetic"
  | "ideographic"
  | "middle"
  | "central"
  | "mathematical"
  | "hanging"
  | "text-top";

// This function was given and modified from:
// https://www.digitalocean.com/community/tutorials/how-to-process-images-in-node-js-with-sharp#step-7-adding-text-on-an-image
export function addTextOnImage(
  text: string,
  {
    height = 72,
    width,
    fontColor = "#151111",
    anchor = "middle",
    // baseline = "hanging",
    fontAsset,
  }: {
    width?: number;
    height?: number;
    fontColor?: string;
    anchor?: "start" | "middle" | "end";
    baseline?: Baseline;
    fontAsset?: string;
  } = {},
) {
  width = width ? Math.floor(width) : Math.floor(height * text.length * 0.5);
  const x = anchor === "middle" ? "50%" : "0";
  const fontCss = fontAsset
    ? `@font-face {
    font-family: "Alumni Sans";
    font-style: normal;
    font-weight: 700;
    unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
  src: url("${fontAsset}");
}`
    : "";
  try {
    const fontSize = `${Math.floor(height * 0.85)}`;
    const svgImage = `
    <svg width="${width}px" height="${height}px" xmlns="http://www.w3.org/2000/svg">
      <style>
      ${fontCss}
      text { 
        fill: ${fontColor};
        font-size: ${fontSize}px;
        text-align: left;
        font-weight: 700;
        font-family: Alumni Sans, Helvetica Neue, Helvetica, sans-serif; 
      }
      </style>
      <text x="${x}" y="50%" text-anchor="${anchor}">${text}</text>
    </svg>
    `;
    return Buffer.from(svgImage);
  } catch (error) {
    // console.log(error);
  }

  return null;
}
