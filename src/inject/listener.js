/* eslint-disable camelcase */
/* eslint-disable no-undef */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener("GAME_START", async () => {
  const game = window.__bran_board.game;
  const gameId = window.location.href.replace(/^\D+/g, "");

  window.__bran_clock = window.__bran_get_clock("liveGame", gameId);
  window.__bran_playingAs = game.getPlayingAs();

  // TODO: Start the game if playingAs === 1
});

window.addEventListener("GAME_OVER", async () => {
  window.__bran_clock = undefined;
  window.__bran_playingAs = undefined;

  // TODO: Start a new game again and to loop
});

window.addEventListener("MOVE", async () => {
  await sleep(256);

  const game = window.__bran_board.game;

  const response = await fetch(`http://localhost:3069/game`, {
    body: JSON.stringify({ fen: game.getFEN() }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const move = await response.json();
  const time = window.__bran_clock.currentClocks[window.__bran_playingAs - 1];

  return game.move({
    ...move,
    time,
    userGenerated: true,
    userGeneratedDrop: true,
  });
});
