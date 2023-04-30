import cors from "cors";
import express, { Application } from "express";

import { gameHandler } from "./handler";

export const server = (): Application => {
  const app = express();

  const origin = "https://www.chess.com";
  app.use(cors({ origin }));

  app.use(express.json());
  app.post("/game", gameHandler);

  return app;
};
