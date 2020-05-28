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
    MAXIMUM: 12288,
    MINIMUM: 4096,
  },
  INSTANT_MOVE: 512,
  LOW_TIME: 32768,
  OPENING_MOVES: 16,
  PORT: 4096,
};

export default config;
