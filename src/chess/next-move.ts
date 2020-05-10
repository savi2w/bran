import { Engine } from "node-uci";

import config from "../config";

const engine = new Engine("/app/komodo-10_ae4bdf/Linux/komodo-10-linux")
  .chain()
  .init();

const getNextMove = async (
  position: string
): Promise<{
  from: string;
  to: string;
}> => {
  const { bestmove: bestMove } = await engine
    .position(position)
    .go({ movetime: config.time });

  return {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2),
  };
};

export default getNextMove;
