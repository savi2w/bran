declare module "node-uci" {
  export class Engine {
    constructor(enginePath: string);
    chain(): EngineChain;
    quit(): Promise<Engine>;
  }

  class EngineChain {
    init(): EngineChain;
    position(fen: string, moves?: ReadonlyArray<string>): EngineChain;
    go(searchOptions: {
      movetime?: number;
    }): Promise<{
      bestmove: string;
      info: ReadonlyArray<string>;
    }>;
  }
}
