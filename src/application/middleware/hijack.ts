import fetch from "node-fetch";
import { HTTPRequest } from "puppeteer-core";

const clientRegExp = /https:\/\/(.*?)chess(.*?)play__beta\.client(.*?)\.js/g;

const useBoard = (playSource: string) => {
  const funRegExp = /getLiveGameChessboard\(e\){return(.*?)},/g;
  const fun = playSource.match(funRegExp)?.shift();

  if (!fun) {
    throw new Error("[CB] Failed to get the main function");
  }

  const retRegExp = /return(.*?)}}/g;
  const ret = fun.match(retRegExp)?.shift();

  if (!ret) {
    throw new Error("[CB] Failed to get the return expression");
  }

  const expression = ret
    .split("return")
    .join("window.__bran_board = ")
    .split("}}")
    .join("; return window.__bran_board }}");

  return playSource.replace(funRegExp, fun.replace(retRegExp, expression));
};

const useClock = (playSource: string) => {
  const source = "function getClock(";
  const payload = "window.__bran_get_clock=getClock;function getClock(";

  return playSource.split(source).join(payload);
};

export const useHijackedClient = () => async (request: HTTPRequest) => {
  const url = request.url();

  if (clientRegExp.test(url)) {
    const response = await fetch(url);
    const source = await response.text();

    return request.respond({
      body: useClock(useBoard(source)),
      contentType: "application/javascript; charset=utf-8",
      status: 200,
    });
  }

  return request.continue();
};
