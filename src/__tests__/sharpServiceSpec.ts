import path from "path";
import { promises as fs } from "fs";
import { resizeImage } from "../services/sharp";

describe("sharp service spec", () => {
  it("resizes an image and saves it to thumb folder", async () => {
    const imgName = "fjord";
    const w = 500;
    const h = 500;
    const thumbPath = `${path.join(
      __dirname,
      "..",
      "..",
      "thumbs"
    )}/${imgName}-${w}x${h}.jpg`;

    const image = await fs.readFile(
      `${path.join(__dirname, "..", "..", "images", "fjord")}.jpg`
    );

    await resizeImage(image, w, h, thumbPath);

    await fs.access(thumbPath);
  });
});
