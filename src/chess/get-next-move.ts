import { Engine } from "node-uci";

const engine = new Engine("/app/Rodent_III/sources/rodentIII")
  .chain()
  .init()
  .setoption("PawnValue", "100")
  .setoption("KnightValue", "325")
  .setoption("BishopValue", "335")
  .setoption("RookValue", "500")
  .setoption("QueenValue", "1000")
  .setoption("KeepPawn", "1")
  .setoption("KeepKnight", "0")
  .setoption("KeepBishop", "0")
  .setoption("KeepRook", "0")
  .setoption("KeepQueen", "0")
  .setoption("BishopPair", "40")
  .setoption("KnightPair", "-10")
  .setoption("ExchangeImbalance", "25")
  .setoption("KnightLikesClosed", "8")
  .setoption("RookLikesOpen", "3")
  .setoption("Material", "100")
  .setoption("OwnAttack", "120")
  .setoption("OppAttack", "100")
  .setoption("OwnMobility", "100")
  .setoption("OppMobility", "120")
  .setoption("KingTropism", "20")
  .setoption("PiecePlacement", "100")
  .setoption("PiecePressure", "100")
  .setoption("PassedPawns", "100")
  .setoption("PawnStructure", "100")
  .setoption("Lines", "100")
  .setoption("Outposts", "120")
  .setoption("Fianchetto", "0")
  .setoption("PawnMass", "100")
  .setoption("PawnChains", "100")
  .setoption("PawnShield", "120")
  .setoption("PawnStorm", "100")
  .setoption("Forwardness", "0")
  .setoption("DoubledPawnMg", "-12")
  .setoption("DoubledPawnEg", "-24")
  .setoption("IsolatedPawnMg", "-10")
  .setoption("IsolatedPawnEg", "-20")
  .setoption("IsolatedOnOpenMg", "-10")
  .setoption("BackwardPawnMg", "-8")
  .setoption("BackwardPawnEg", "-10")
  .setoption("BackwardOnOpenMg", "-8")
  .setoption("PstStyle", "0")
  .setoption("MobilityStyle", "0")
  .setoption("NpsLimit", "30000")
  .setoption("EvalBlur", "0")
  .setoption("Contempt", "0")
  .setoption("SearchSkill", "10")
  .setoption("RiskyDepth", "0")
  .setoption("SlowMover", "100")
  .setoption("Selectivity", "175")
  .setoption("BookFilter", "20")
  .setoption("GuideBookFile", "guide/solid.bin")
  .setoption("MainBookFile", "rodent.bin");

const getNextMove = async (
  moveTime: number,
  position: string
): Promise<{
  from: string;
  to: string;
}> => {
  const { bestmove: bestMove } = await engine
    .position(position)
    .go({ movetime: moveTime });

  return {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2),
  };
};

export default getNextMove;
