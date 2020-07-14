# Chest

Chess player for [https://www.chess.com/](https://www.chess.com/)  
Powered by [Rodent III](https://github.com/nescitus/Rodent_III.git/)

**FOR STUDY PURPOSES ONLY**

## Usage

Disable X11 Acess Control

```sh
$ xhost +
```

And then execute the docker-compose

```sh
$ docker-compose up --build
```

## Personality

Chest simulates a player with 2300 ELO Rating (FIDE) playing blitz at https://www.chess.com/

- Play fast during the opening phase
- Play fast if you are in time trouble
- Play normally in mid game

## Known Behaviors

- When a match starts and you're the white player, you need to do the first move manually
