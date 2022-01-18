import sharp from "sharp";

export async function resizeImage(
  img: Buffer,
  w: number,
  h: number,
  thumbPath: string
) {
  return await sharp(img).resize(w, h).toFile(thumbPath);
}
