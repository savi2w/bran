import { Engine } from "node-uci";

const engine = new Engine("/app/Rodent_III/sources/rodentIII")
  .chain()
  .init()
  .setoption("PawnValue", "100")
  .setoption("KnightValue", "335")
  .setoption("BishopValue", "335")
  .setoption("RookValue", "500")
  .setoption("QueenValue", "1000")
  .setoption("KeepPawn", "0")
  .setoption("KeepKnight", "0")
  .setoption("KeepBishop", "0")
  .setoption("KeepRook", "0")
  .setoption("KeepQueen", "0")
  .setoption("BishopPair", "50")
  .setoption("KnightPair", "-10")
  .setoption("ExchangeImbalance", "25")
  .setoption("KnightLikesClosed", "6")
  .setoption("RookLikesOpen", "3")
  .setoption("Material", "90")
  .setoption("OwnAttack", "50")
  .setoption("OppAttack", "70")
  .setoption("OwnMobility", "120")
  .setoption("OppMobility", "100")
  .setoption("KingTropism", "20")
  .setoption("PiecePlacement", "100")
  .setoption("PiecePressure", "150")
  .setoption("PassedPawns", "100")
  .setoption("PawnStructure", "100")
  .setoption("Lines", "105")
  .setoption("Outposts", "110")
  .setoption("Fianchetto", "0")
  .setoption("PawnMass", "110")
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
  .setoption("NpsLimit", "5500")
  .setoption("EvalBlur", "0")
  .setoption("Contempt", "0")
  .setoption("SearchSkill", "10")
  .setoption("RiskyDepth", "0")
  .setoption("SlowMover", "100")
  .setoption("Selectivity", "175")
  .setoption("BookFilter", "20")
  .setoption("GuideBookFile", "ph-exoticbook.bin")
  .setoption("MainBookFile", "micro.bin");

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
