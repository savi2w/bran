import { Engine } from "node-uci";
import os from "os";
import path from "path";

const bin = path.join(__dirname, "..", "..", "bin");

const getEnginePath = (): string => {
  const platformHandler: Record<string, string | undefined> = {
    win32: path.join(bin, "win32.exe"),
  };

  const engine = platformHandler[process.platform];
  if (!engine) {
    throw new Error(process.platform + " engine binary not found");
  }

  return engine;
};

const engine = new Engine(getEnginePath())
  .chain()
  .init()
  .setoption("Personality", "Pedrita")
  .setoption("Threads", os.cpus().length.toString());

export const getNextMove = async (
  depth: number,
  position: string
): Promise<unknown> => {
  const { bestmove: bestMove } = await engine.position(position).go({ depth });

  // Sometimes the engine just fails
  if (bestMove.length !== 4) {
    return getNextMove(depth, position);
  }

  return {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2),
  };
};
