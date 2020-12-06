import puppeteer from "puppeteer-core";

import config, { Config } from "../config";

interface ExtendedWindow extends Window {
  CLIENT_ID: string;
  PREVIOUS_HISTORY?: { from: string; to: string }[];
}

type CustomWindow = ExtendedWindow & typeof globalThis;

declare let window: CustomWindow;

interface InterceptMoveEvent extends Event {
  detail: {
    encode: (move: { from: string; to: string }) => string;
    history: { from: string; to: string }[];
  };
}

const useAutoChess = (config: Config) => {
  window.addEventListener("INTERCEPT_MOVE", async (event) => {
    const resignButton = document.querySelector(
      "#board-layout-sidebar > div > div.sidebar-tabset.sidebar-tabsetTop > div.tabset-content-component.tabset-content-darkMode > div > div.game-buttons-component.game-buttons-darkMode > div.game-buttons-playing > div.resign-button-component.resign-button-darkMode > span.resign-button-label"
    );

    if (!resignButton) {
      window.PREVIOUS_HISTORY = [];

      return undefined;
    }

    const interceptMove = event as InterceptMoveEvent;
    const { encode, history } = interceptMove.detail;

    const previousHistory = window.PREVIOUS_HISTORY?.length ?? 0;
    if (history.length <= previousHistory) {
      return undefined;
    }

    window.PREVIOUS_HISTORY = history;
    const color = document.querySelector(
      "#board-layout-player-bottom .board-player-default-black"
    )
      ? "BLACK"
      : "WHITE";

    const QUOTIENT = 2;
    const REMAINDER = 0;
    const enemyMove =
      color === "BLACK"
        ? history.length % QUOTIENT !== REMAINDER
        : history.length % QUOTIENT === REMAINDER;

    if (!enemyMove) {
      return undefined;
    }

    const clock = document.getElementById("main-clock-bottom");
    if (!clock) {
      return undefined;
    }

    const [minutes, seconds] = clock.innerText.split(":");
    const ms = parseInt(minutes) * 60000 + parseInt(seconds) * 1000;

    const gameId = window.location.href.replace(/\D/g, "");

    const moveTime =
      ms <= config.LOW_TIME
        ? config.INSTANT_MOVE
        : history.length <= config.OPENING_MOVES
        ? config.INSTANT_MOVE
        : Math.floor(
            Math.random() *
              (config.COMMON_MOVE.MAXIMUM - config.COMMON_MOVE.MINIMUM + 1)
          ) + config.COMMON_MOVE.MINIMUM;

    const response = await fetch(`http://localhost:${config.PORT}/move`, {
      body: JSON.stringify({ history, moveTime }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const counterMove: { from: string; to: string } = await response.json();
    const encodedCounterMove = encode(counterMove);

    const moveId = history.length.toString();

    const username = document.querySelector(
      "#board-layout-player-bottom > div > div.board-player-default-userTagline > div.user-tagline-component.user-tagline-responsive.user-tagline-darkMode.user-tagline-mainBoard > a.user-tagline-username"
    ) as HTMLElement | undefined;

    if (!username) {
      return undefined;
    }

    return fetch("https://live2.chess.com/cometd/", {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: `[{"channel":"/service/game","data":{"move":{"clock":${ms
        .toString()
        .slice(
          0,
          4
        )},"gid":${gameId},"move":"${encodedCounterMove}","seq":${moveId},"uid":"${
        username.innerText
      }","clockms":${ms.toString()}},"sid":"gserv","tid":"Move"},"id":"${moveId}","clientId":"${
        window.CLIENT_ID
      }"}]`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
  });
};

const useLongPolling = () => {
  setTimeout(() => {
    const liveStorage = localStorage.getItem("live_storage");
    if (liveStorage) {
      const liveTransport = "ssl-long-polling";
      if (liveStorage.indexOf(liveTransport) === -1) {
        window.localStorage.setItem(
          "live_storage",
          `{"live_settings":{"animationtype":"default","autoqueen":true,"autotop":false,"board":"bases","challenge":0,"challengealert":0,"challengemaxrating":400,"challengeminrating":-400,"chatrequest":0,"config":null,"confirmresign":false,"coord":true,"darkmode":true,"evalbar":null,"evallines":true,"eventannouncement":0,"flip":false,"focusmode":false,"friendalert":0,"gamechat":0,"hl":true,"layoutconfig":null,"lowtimewarning":10,"markings":true,"movemethod":"drag","multi":false,"outsidecoord":false,"piecenotation":"text","pieces":"bases","pre":true,"quickanalysis":false,"seekbasetime":0,"seekbasetimechess":1800,"seekbasetimevariants":null,"seekcolor":0,"seekfilterhidevariants":false,"seekfiltermaxrating":400,"seekfiltermaxtime":null,"seekfilterminrating":-400,"seekfiltermintime":null,"seekfilterpremiumonly":false,"seekfilterratedonly":true,"seekgametype":"chess","seekgraph":false,"seekincrement":0,"seekincrementchess":0,"seekincrementvariants":null,"seekmaxrating":400,"seekminrating":-400,"seekrated":1,"showlegalmoves":false,"showtimestamps":true,"simultautoswitch":false,"sounds":true,"soundtheme":"default"},"timeIncrementTip":true,"tabset_collapsed":false,"dgtboard":false,"liveNetwork":"auto","liveTransport":"${liveTransport}","alertsDisabled":false}`
        );

        window.location.reload();
      }
    }
  }, 1200);
};

const loadMiddleware = (page: puppeteer.Page): Promise<void[]> =>
  Promise.all([
    page.evaluate(useAutoChess, config),
    page.evaluate(useLongPolling),
  ]);

export default loadMiddleware;
