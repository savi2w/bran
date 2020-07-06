import cors from "cors";
import express from "express";

import moveHandler from "./move-handler";

const server = (): express.Application => {
  const app = express();

  const origin = "https://www.chess.com";
  app.use(cors({ origin }));

  app.use(express.json());
  app.post("/move", moveHandler);

  return app;
};

export default server;
