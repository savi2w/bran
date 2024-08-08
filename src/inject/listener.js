/* eslint-disable camelcase */
/* eslint-disable no-undef */

const getRandomInt = (minimum, maximum) => {
  return (
    Math.floor(Math.random() * (Math.floor(maximum) - Math.ceil(minimum) + 1)) +
    Math.ceil(minimum)
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener("GAME_START", async () => {
  const game = window.__bran_board.game;

  window.__bran_playingAs = game.getPlayingAs();

  if (window.__bran_playingAs === 1) {
    await sleep(1024);

    return window.dispatchEvent(new Event("MOVE"));
  }
});

window.addEventListener("GAME_OVER", async () => {
  window.__bran_clock = undefined;
  window.__bran_playingAs = undefined;

  await sleep(2048);

  document
    .querySelector(
      "#board-layout-sidebar > div > div.tab-content-component > div.new-game-buttons-component > button:nth-child(1)"
    )
    .click();
});

window.addEventListener("MOVE", async () => {
  const game = window.__bran_board.game;
  const time = window.__bran_clock.currentClocks[window.__bran_playingAs - 1];

  const lowTime = window.__bran_clock.lowTime.some((bool) => bool);

  if (!lowTime) {
    await sleep(256);
  }

  const response = await fetch(`http://localhost:3069/game`, {
    body: JSON.stringify({ depth: lowTime ? 4 : 16, fen: game.getFEN() }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const move = await response.json();

  if (!lowTime) {
    await sleep(getRandomInt(256, 3072));
  }

  return game.move({
    ...move,
    time,
    userGenerated: true,
    userGeneratedDrop: true,
  });
});
