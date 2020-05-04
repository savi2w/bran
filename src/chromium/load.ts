import puppeteer from "puppeteer-core";

import config from "../config";

type Move = {
  from: string;
  to: string;
};

type History = Move[];

interface ExtendedWindow extends Window {
  CLIENT_ID: string;
  CLOCK: number;
  PREVIOUS_HISTORY?: History;
}

type CustomWindow = ExtendedWindow & typeof globalThis;

declare let window: CustomWindow;

interface InterceptMoveEvent extends Event {
  detail: {
    encode: (move: Move) => string;
    history: History;
  };
}

const useAutoChess = (port: number) => {
  const sendMove = (
    moveId: string,
    encodedCounterMove: string,
    clientId: string,
    gameId: string,
    ms: number,
    username: string
  ) =>
    fetch("https://live2.chess.com/cometd/", {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: `[{"channel":"/service/game","data":{"move":{"clock":${ms
        .toString()
        .slice(
          0,
          4
        )},"gid":${gameId},"move":"${encodedCounterMove}","seq":${moveId},"uid":"${username}","clockms":${ms.toString()}},"sid":"gserv","tid":"Move"},"id":"${moveId}","clientId":"${clientId}"}]`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    });

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
      "#board-layout-player-bottom .board-player-default-white"
    )
      ? "WHITE"
      : "BLACK";

    const QUOTIENT = 2;
    const REMAINDER = 0;
    const enemyMove =
      color === "WHITE"
        ? history.length % QUOTIENT === REMAINDER
        : history.length % QUOTIENT !== REMAINDER;

    if (!enemyMove) {
      return undefined;
    }

    const moveId = history.length.toString();
    const response = await fetch(`http://localhost:${port}/move`, {
      body: JSON.stringify({ history }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const counterMove: Move = await response.json();
    const encodedCounterMove = encode(counterMove);

    const clientId = window.CLIENT_ID;
    const clock = document.getElementById("main-clock-bottom");

    if (!clock) {
      return undefined;
    }

    const gameId = window.location.href.replace(/\D/g, "");

    const [minutes, seconds] = clock.innerText.split(":");
    const ms = parseInt(minutes) * 60000 + parseInt(seconds) * 1000;

    const username = document.querySelector(
      "#board-layout-player-bottom > div > div.board-player-default-userTagline > div.user-tagline-component.user-tagline-responsive.user-tagline-darkMode.user-tagline-mainBoard > a.user-tagline-username"
    ) as HTMLElement | undefined;

    if (!username) {
      return undefined;
    }

    return sendMove(
      moveId,
      encodedCounterMove,
      clientId,
      gameId,
      ms,
      username.innerText
    );
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
          `{"dgtboard":false,"liveNetwork":"auto","liveTransport":"${liveTransport}","live_settings":{"animationtype":"default","autoqueen":true,"autotop":false,"board":"green","challenge":0,"challengealert":0,"challengemaxrating":null,"challengeminrating":null,"chatrequest":0,"config":null,"confirmresign":false,"coord":true,"darkmode":true,"evalbar":null,"evallines":null,"eventannouncement":0,"flip":false,"focusmode":false,"friendalert":0,"gamechat":0,"hl":true,"layoutconfig":null,"lowtimewarning":0,"markings":false,"movemethod":"drag","multi":false,"outsidecoord":false,"piecenotation":"text","pieces":"neo","pre":false,"quickanalysis":false,"seekbasetime":0,"seekbasetimechess":6000,"seekbasetimevariants":null,"seekcolor":0,"seekfilterhidevariants":false,"seekfiltermaxrating":null,"seekfiltermaxtime":null,"seekfilterminrating":null,"seekfiltermintime":null,"seekfilterpremiumonly":false,"seekfilterratedonly":false,"seekgametype":"chess","seekgraph":true,"seekincrement":0,"seekincrementchess":0,"seekincrementvariants":null,"seekmaxrating":200,"seekminrating":-200,"seekrated":1,"showlegalmoves":true,"showtimestamps":true,"simultautoswitch":false,"sounds":false,"soundtheme":"default"}}`
        );

        window.location.reload(true);
      }
    }
  }, 1200);
};

const loadMiddleware = (page: puppeteer.Page) =>
  Promise.all([
    page.evaluate(useAutoChess, config.port),
    page.evaluate(useLongPolling),
  ]);

export default loadMiddleware;
