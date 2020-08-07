# Chest

Chess player for [https://www.chess.com/](https://www.chess.com/)  
Powered by [Rodent III](https://github.com/nescitus/Rodent_III.git/)

**FOR STUDY PURPOSES ONLY**

## Requirements

- Chromium
- A chess engine which support UCI protocol
  - ([bin/rodent](bin/rodent) is a pre-built binary which works in Linux)

## Usage

- `yarn`
- `yarn build`
- `yarn start`

## Personality

Chest simulates a player with 2300 ELO Rating (FIDE) playing blitz at https://www.chess.com/

- Play fast during the opening phase
- Play fast if you are in time trouble
- Play normally in mid game

## Known Behaviors

- When a match starts and you're the white player, you need to do the first move manually
