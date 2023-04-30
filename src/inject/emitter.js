/* eslint-disable camelcase */
/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */

Promise.resolve().then(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    await sleep(128);

    if (!window.__bran_board) continue; // The player isn't in "Play Game"

    const emitter = { event: undefined };
    const playingAs = window.__bran_board.game.getPlayingAs();
    const turn = window.__bran_board.game.getTurn();

    if (!emitter.event) {
      const isGameStart = !window.__bran_emitter_playingAs && playingAs;

      if (isGameStart) {
        emitter.event = new Event("GAME_START");
      }
    }

    if (!emitter.event) {
      const isGameOver = !playingAs && window.__bran_emitter_playingAs;

      if (isGameOver) {
        emitter.event = new Event("GAME_OVER");
      }
    }

    if (!emitter.event) {
      const isTurnChange = turn && turn !== window.__bran_emitter_turn;

      if (isTurnChange) {
        const isPlayerTurn = playingAs && playingAs === turn;

        if (isPlayerTurn) {
          emitter.event = new Event("MOVE");
        }
      }
    }

    /* Little hack to dispatch one event per iteration */
    if (emitter.event) {
      window.dispatchEvent(emitter.event);
    }

    /* Emitter has their own prefix to avoid collision */
    window.__bran_emitter_playingAs = playingAs;
    window.__bran_emitter_turn = turn;
  }
});
