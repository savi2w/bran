import { Engine } from "node-uci";

import config from "../config";

const getNextMove = async (
  position: string
): Promise<{
  from: string;
  to: string;
}> => {
  const engine = new Engine("/app/komodo-10_ae4bdf/Linux/komodo-10-linux");
  const { bestmove: bestMove } = await engine
    .chain()
    .init()
    .position(position)
    .go({ movetime: config.time });

  await engine.quit();
  return {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2),
  };
};

export default getNextMove;
