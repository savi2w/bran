export type Config = {
  COMMON_MOVE: {
    MAXIMUM: number;
    MINIMUM: number;
  };
  INSTANT_MOVE: number;
  LOW_TIME: number;
  OPENING_MOVES: number;
  PORT: number;
};

const config: Config = {
  COMMON_MOVE: {
    MAXIMUM: 16384,
    MINIMUM: 2048,
  },
  INSTANT_MOVE: 2048,
  LOW_TIME: 61440,
  OPENING_MOVES: 32,
  PORT: 4096,
};

export default config;
