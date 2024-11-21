/* eslint-disable camelcase */
/* eslint-disable no-undef */

window.__bran_depth = 1;
window.__bran_factor = 1.6;

setInterval(() => {
  const span = document.querySelector(
    "#board-layout-player-bottom > div.player-component.player-bottom > div.clock-component.clock-bottom > span"
  );

  if (!span) return;
  if (!span.innerText) return;

  const [minutes, seconds] = span.innerText.split(":");

  if (!minutes) return;
  if (!seconds) return;

  const minutesInt = parseInt(minutes);
  const secondsInt = parseInt(seconds.split(".")[0]);

  if (isNaN(minutesInt)) return;
  if (isNaN(secondsInt)) return;

  const currentTimeInSeconds = minutesInt * 60 + secondsInt;

  if (currentTimeInSeconds <= 0) return;

  if (currentTimeInSeconds <= 60) {
    window.__bran_delay = 512 + 256;
    window.__bran_depth = 1;
  }

  if (currentTimeInSeconds <= 30) {
    window.__bran_delay = 512 + 128;
    window.__bran_depth = 2;
  }

  if (currentTimeInSeconds <= 20) window.__bran_delay = 256;
  if (currentTimeInSeconds <= 10) window.__bran_delay = 128;
  if (currentTimeInSeconds <= 6) window.__bran_delay = 64;
  if (currentTimeInSeconds <= 4) {
    window.__bran_delay = 32;
    window.__bran_depth = 4;
  }

  if (currentTimeInSeconds <= 2) window.__bran_delay = 16;
  if (currentTimeInSeconds <= 1) window.__bran_delay = 0;

  console.log(
    `time=${currentTimeInSeconds}s delay=${window.__bran_delay}ms depth=${window.__bran_depth} factor=${window.__bran_factor}`
  );
}, 512);

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
  window.__bran_playingAs = undefined;

  await sleep(4096);

  let button = undefined;

  while (!button) {
    await sleep(1024);

    button = document.querySelector(
      "#board-layout-chessboard > div.board-modal-container-container > div > div > div.game-over-modal-buttons > div.game-over-buttons-component > button:nth-child(1)"
    );

    if (button) button.click();
  }
});

window.addEventListener("MOVE", async () => {
  const game = window.__bran_board.game;

  await sleep(
    getRandomInt(
      window.__bran_delay,
      window.__bran_delay * window.__bran_factor
    )
  );

  await sleep(
    getRandomInt(
      window.__bran_delay,
      window.__bran_delay * window.__bran_factor
    )
  );

  const response = await fetch(`http://localhost:3069/game`, {
    body: JSON.stringify({ depth: window.__bran_depth, fen: game.getFEN() }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const move = await response.json();

  return game.move({
    ...move,
    userGenerated: true,
    userGeneratedDrop: true,
  });
});
