/* eslint-disable camelcase */
/* eslint-disable no-undef */

window.__bran_depth = 1;
window.__bran_factor = 1.8;
window.__bran_pm_percentage = 40;

const getRandomInt = (minimum, maximum) => {
  return (
    Math.floor(Math.random() * (Math.floor(maximum) - Math.ceil(minimum) + 1)) +
    Math.ceil(minimum)
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentTime = () => {
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

  window.__bran_current_time_in_seconds = minutesInt * 60 + secondsInt;
};

const newPreferences = () => {
  window.__bran_move_number += 1;

  getCurrentTime();

  if (isNaN(window.__bran_current_time_in_seconds)) return;
  if (window.__bran_current_time_in_seconds <= 0) return;

  if (window.__bran_current_time_in_seconds <= 180) {
    window.__bran_delay = 256;
    window.__bran_depth = 4;
  }

  if (window.__bran_current_time_in_seconds <= 150) {
    if (getRandomInt(0, 100) >= 100 - window.__bran_pm_percentage) {
      window.__bran_delay = 0;
    } else {
      window.__bran_delay = 1024;
    }

    window.__bran_depth = 5;
  }

  if (window.__bran_current_time_in_seconds <= 120) {
    if (getRandomInt(0, 100) >= 100 - window.__bran_pm_percentage) {
      window.__bran_delay = 0;
    } else {
      window.__bran_delay = 512;
    }

    window.__bran_depth = 4;
  }

  if (window.__bran_current_time_in_seconds <= 90) {
    if (getRandomInt(0, 100) >= 100 - window.__bran_pm_percentage) {
      window.__bran_delay = 0;
    } else {
      window.__bran_delay = 256 + 128;
    }

    window.__bran_depth = 3;
  }

  if (window.__bran_current_time_in_seconds <= 60) {
    if (getRandomInt(0, 100) >= 100 - window.__bran_pm_percentage) {
      window.__bran_delay = 0;
    } else {
      window.__bran_delay = 256;
    }

    window.__bran_depth = 2;
  }

  if (window.__bran_current_time_in_seconds <= 30) {
    if (getRandomInt(0, 100) >= 100 - window.__bran_pm_percentage) {
      window.__bran_delay = 0;
    } else {
      window.__bran_delay = 128;
    }

    window.__bran_depth = 2;
  }

  if (window.__bran_current_time_in_seconds <= 20) {
    window.__bran_delay = 0;
    window.__bran_depth = 2;
  }
};

window.addEventListener("GAME_START", async () => {
  const game = window.__bran_board.game;

  window.__bran_move_number = 0;
  window.__bran_playingAs = game.getPlayingAs();

  if (window.__bran_playingAs === 1) {
    window.dispatchEvent(new Event("MOVE"));

    return;
  }
});

window.addEventListener("GAME_OVER", async () => {
  window.__bran_playingAs = undefined;
});

window.addEventListener("MOVE", async () => {
  newPreferences();

  const game = window.__bran_board.game;

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

  await sleep(
    getRandomInt(
      window.__bran_delay,
      window.__bran_delay * window.__bran_factor
    )
  );

  return game.move({
    ...move,
    userGenerated: true,
    userGeneratedDrop: true,
  });
});
