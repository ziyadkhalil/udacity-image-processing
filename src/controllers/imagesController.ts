import express from "express";
import { isNumeric } from "../util/isNumeric";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

export async function imagesController(
  req: express.Request,
  res: express.Response
) {
  const { fileName, width, height } = req.query as {
    fileName?: string;
    width?: string;
    height?: string;
  };

  if (!fileName) return res.status(400).send("File name is required");

  const shouldResize = width && height && isNumeric(width) && isNumeric(height);

  try {
    const image = await fs.readFile(
      `${path.join(__dirname, "..", "images", fileName)}.jpg`
    );

    if (!shouldResize) {
      res.write(image, (err) => {
        if (err) return res.status(400).send(err.message);
        return res.end();
      });
    }

    if (shouldResize) {
      const thumbPath =
        path.join(__dirname, "..", "thumbs") +
        `/${fileName}-${width}x${height}.jpg`;

      try {
        //Check if cached
        await fs.access(thumbPath);
        res.sendFile(thumbPath);
      } catch (e) {
        await sharp(image)
          .resize(Number(width), Number(height))
          .toFile(thumbPath);
        return res.sendFile(thumbPath);
      }
    }
  } catch (e) {
    if (e instanceof Error) return res.status(400).send(e.message);
    console.error(e);
  }
}
