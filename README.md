# Chest

Chess player for [https://www.chess.com/](https://www.chess.com/)  
Powered by [Rodent III](https://github.com/nescitus/Rodent_III.git/)

## Requirements

- Chromium
- A chess engine which support UCI protocol
  - The [bin folder](bin) has a [`Rodent_III`](https://github.com/nescitus/Rodent_III) pre-built binary for macOS, Linux and Windows

## Usage

- `npm install`
- `npm run build`
- `npm run start`

## Personality

Chest simulates a player with 2300 ELO Rating (FIDE) playing blitz at https://www.chess.com/

- Play fast during the opening phase
- Play fast if you are in time trouble
- Play normally in mid game

## Known Behaviors

- When a match starts and you're the white player, you need to do the first move manually

## License

This project is distributed under the [MIT license](LICENSE)
