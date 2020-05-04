declare module "@ninjapixel/chess" {
  export class Chess {
    move(coordinates: { from: string; to: string }): void;
    fen(): string;
  }
}
