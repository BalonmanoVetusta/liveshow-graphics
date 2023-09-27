// This function was given and modified from:
// https://www.digitalocean.com/community/tutorials/how-to-process-images-in-node-js-with-sharp#step-7-adding-text-on-an-image
export function addTextOnImage(
  text: string,
  {
    height = 72,
    fontColor = "#151111",
    anchor = "middle",
    fontAsset,
  }: { height?: number; fontColor?: string; anchor?: "start" | "middle" | "end"; fontAsset?: string } = {},
) {
  const width = 0.3 * text.length * height;
  const x = anchor === "middle" ? "50%" : "0";
  const fontCss = fontAsset
    ? `@font-face {
  font-family: 'Alumni Sans';
  font-style: normal;
  font-weight: 700;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
  src: url('${fontAsset}) format('truetype');
}`
    : "";
  try {
    const fontSize = `${height * 0.8}px`;
    const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      ${fontCss}
      text { 
        fill: ${fontColor};
        font-size: ${fontSize};
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
