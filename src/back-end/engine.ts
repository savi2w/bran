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
  .setoption("Threads", os.cpus().length.toString())
  .setoption("PawnValueMg", "90")
  .setoption("KnightValueMg", "380")
  .setoption("BishopValueMg", "390")
  .setoption("RookValueMg", "530")
  .setoption("QueenValueMg", "1160")
  .setoption("PawnValueEg", "110")
  .setoption("KnightValueEg", "360")
  .setoption("BishopValueEg", "370")
  .setoption("RookValueEg", "650")
  .setoption("QueenValueEg", "1190")
  .setoption("KeepPawn", "0")
  .setoption("KeepKnight", "0")
  .setoption("KeepBishop", "0")
  .setoption("KeepRook", "0")
  .setoption("KeepQueen", "0")
  .setoption("BishopPairMg", "51")
  .setoption("BishopPairEg", "51")
  .setoption("KnightPair", "-1")
  .setoption("RookPair", "-11")
  .setoption("KnightLikesClosed", "6")
  .setoption("RookLikesOpen", "0")
  .setoption("ExchangeImbalance", "10")
  .setoption("MinorVsQueen", "10")
  .setoption("Material", "105")
  .setoption("OwnAttack", "100")
  .setoption("OppAttack", "110")
  .setoption("OwnMobility", "50")
  .setoption("OppMobility", "55")
  .setoption("FlatMobility", "50")
  .setoption("KingTropism", "20")
  .setoption("PrimaryPstWeight", "60")
  .setoption("SecondaryPstWeight", "40")
  .setoption("PiecePressure", "109")
  .setoption("PassedPawns", "100")
  .setoption("PawnStructure", "110")
  .setoption("Lines", "100")
  .setoption("Outposts", "85")
  .setoption("Space", "10")
  .setoption("PawnShield", "119")
  .setoption("PawnStorm", "99")
  .setoption("DoubledPawnMg", "-8")
  .setoption("DoubledPawnEg", "-21")
  .setoption("IsolatedPawnMg", "-7")
  .setoption("IsolatedPawnEg", "-7")
  .setoption("IsolatedOnOpenMg", "-13")
  .setoption("BackwardPawnMg", "-2")
  .setoption("BackwardPawnEg", "-1")
  .setoption("BackwardOnOpenMg", "-10")
  .setoption("FianchBase", "13")
  .setoption("FianchKing", "20")
  .setoption("ReturningB", "10")
  .setoption("PawnMass", "100")
  .setoption("PawnChains", "100")
  .setoption("PrimaryPstStyle", "2")
  .setoption("SecondaryPstStyle", "2")
  .setoption("blockedcpawn", "-17")
  .setoption("Contempt", "-5")
  .setoption("SlowMover", "100")
  .setoption("Selectivity", "175")
  .setoption("SearchSkill", "10")
  .setoption("BookFilter", "20")
  .setoption("GuideBookFile", "guide/petrosian.bin")
  .setoption("MainBookFile", "players/petrosian.bin");

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
