import sharp from "sharp";
import fs from "fs";
import path from "path";

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#121110"/>
  <rect x="12" y="12" width="488" height="488" rx="116" fill="none" stroke="#262320" stroke-width="8"/>
  <circle cx="120" cy="256" r="54" fill="#1D99DE"/>
  <circle cx="256" cy="256" r="54" fill="#F49924"/>
  <circle cx="392" cy="256" r="54" fill="#D21871"/>
</svg>`;

async function main() {
  const root = process.cwd();
  const publicDir = path.join(root, "public");
  const appDir = path.join(root, "src", "app");

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

  // 1. Write SVG icons
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), SVG_CONTENT, "utf-8");
  fs.writeFileSync(path.join(appDir, "icon.svg"), SVG_CONTENT, "utf-8");
  console.log("Written favicon.svg and icon.svg");

  const svgBuffer = Buffer.from(SVG_CONTENT);

  // 2. Generate PNGs (180x180 for Apple, 32x32, 16x16)
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), png180);
  fs.writeFileSync(path.join(appDir, "apple-icon.png"), png180);
  console.log("Written apple-touch-icon.png and apple-icon.png (180x180)");

  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

  // 3. Build multi-resolution ICO (16x16 + 32x32)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // icon type
  icoHeader.writeUInt16LE(2, 4); // 2 images (16x16 and 32x32)

  const offset1 = 6 + 16 * 2; // header + 2 entries = 38
  const offset2 = offset1 + png16.length;

  const entry16 = Buffer.alloc(16);
  entry16.writeUInt8(16, 0); // width
  entry16.writeUInt8(16, 1); // height
  entry16.writeUInt8(0, 2);  // palette colors
  entry16.writeUInt8(0, 3);  // reserved
  entry16.writeUInt16LE(1, 4); // color planes
  entry16.writeUInt16LE(32, 6); // bpp
  entry16.writeUInt32LE(png16.length, 8); // size
  entry16.writeUInt32LE(offset1, 12); // offset

  const entry32 = Buffer.alloc(16);
  entry32.writeUInt8(32, 0); // width
  entry32.writeUInt8(32, 1); // height
  entry32.writeUInt8(0, 2);  // palette colors
  entry32.writeUInt8(0, 3);  // reserved
  entry32.writeUInt16LE(1, 4); // color planes
  entry32.writeUInt16LE(32, 6); // bpp
  entry32.writeUInt32LE(png32.length, 8); // size
  entry32.writeUInt32LE(offset2, 12); // offset

  const icoBuffer = Buffer.concat([icoHeader, entry16, entry32, png16, png32]);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), icoBuffer);
  console.log("Written favicon.ico (multi-resolution 16x16 + 32x32)");

  console.log("All favicon assets generated successfully.");
}

main().catch((err) => {
  console.error("Failed to generate favicons:", err);
  process.exit(1);
});
