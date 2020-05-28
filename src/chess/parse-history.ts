import { Chess } from "@ninjapixel/chess";

const parseHistory = (history: { from: string; to: string }[]): string => {
  const board = new Chess();
  history.map((coordinates) => board.move(coordinates));

  return board.fen();
};

export default parseHistory;
