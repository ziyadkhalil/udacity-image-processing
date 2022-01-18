import express from "express";
import { isNumeric } from "../util/isNumeric";
import { promises as fs } from "fs";
import path from "path";
import { resizeImage } from "../services/sharp";

type QueryParams = {
  fileName?: string;
  width?: string;
  height?: string;
};

export async function imagesController(
  req: express.Request<unknown, unknown, unknown, QueryParams>,
  res: express.Response
) {
  const { fileName } = req.query;

  if (!fileName) return res.status(400).send("File name is required");

  const shouldResize = !!req.query.width || !!req.query.height;

  try {
    const image = await fs.readFile(
      `${path.join(__dirname, "..", "..", "images", fileName)}.jpg`
    );

    if (!shouldResize) {
      res.write(image, (err) => {
        if (err) return res.status(400).send(err.message);
        return res.end();
      });
    } else {
      const { w, h } = parseQueryParams(req.query);

      const thumbPath =
        path.join(__dirname, "..", "..", "thumbs") +
        `/${fileName}-${w}x${h}.jpg`;

      try {
        //Check if cached
        await fs.access(thumbPath);
        res.sendFile(thumbPath);
      } catch (e) {
        await resizeImage(image, w, h, thumbPath);
        return res.sendFile(thumbPath);
      }
    }
  } catch (e) {
    if (e instanceof Error) return res.status(404).send(e.message);
    console.error(e);
  }
}

function parseQueryParams(queryParams: QueryParams) {
  let w;
  let h;

  if (!queryParams.width || !queryParams.height) {
    throw new Error("You need to specifiy both width and height");
  }

  if (isNumeric(queryParams.width)) w = Number(queryParams.width);
  else throw new Error("Invalid width");

  if (isNumeric(queryParams.height)) h = Number(queryParams.height);
  else throw new Error("Invalid height");

  return { w, h };
}
