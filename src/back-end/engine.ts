import { Engine } from "node-uci";
import os from "os";
import path from "path";

const bin = path.join(__dirname, "..", "..", "bin");

/* I think Rodent-IV doesn't have support to POSIX systems */
const getEnginePath = (): string => {
  const platformHandler: Record<string, string | undefined> = {
    darwin: path.join(bin, "darwin"),
    linux: path.join(bin, "linux"),
    win32: path.join(bin, "win32.exe"),
  };

  const engine = platformHandler[process.platform];
  if (!engine) {
    throw new Error(process.platform + " nescitus/Rodent-IV binary not found");
  }

  return engine;
};

const engine = new Engine(getEnginePath())
  .chain()
  .init()
  .setoption("Threads", os.cpus().length.toString());

export const getNextMove = async (position: string): Promise<unknown> => {
  const { bestmove: bestMove } = await engine
    .position(position)
    .go({ depth: 22 });

  // Sometimes the engine just fails
  if (bestMove.length !== 4) {
    return getNextMove(position);
  }

  return {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2),
  };
};
