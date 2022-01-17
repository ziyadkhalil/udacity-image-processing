import express from "express";

import { imagesController } from "./controllers/imagesController";

const routes = express.Router();

routes.get("/images", imagesController);

export default routes;
