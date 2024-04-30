import fetch from "node-fetch";
import { HTTPRequest } from "puppeteer-core";

const clientRegExp =
  /https:\/\/(.*?)chess\.com\/chesscom-artifacts(.*?)play\.client(.*?)\.js/g;

const useBoard = (playSource: string) => {
  const funRegExp = /function getChessboard\(e\){return(.*?)}function /g;
  const fun = playSource.match(funRegExp)?.shift();

  if (!fun) {
    throw new Error("[CB] Failed to get getChessboard function");
  }

  const retRegExp = /return(.*?)]}/g;
  const ret = fun.match(retRegExp)?.shift();

  if (!ret) {
    throw new Error("[CB] Failed to get the getChessboard return expression");
  }

  const expression = ret
    .split("return")
    .join("window.__bran_board =")
    .split("]}")
    .join("]; return window.__bran_board }");

  return playSource.replace(funRegExp, fun.replace(retRegExp, expression));
};

const useClock = (playSource: string) => {
  const funRegExp = /function getClock\(e\){return(.*?)}},/g;
  const fun = playSource.match(funRegExp)?.shift();

  if (!fun) {
    throw new Error("[CB] Failed to get getClock function");
  }

  const retRegExp = /return(.*?)}}/g;
  const ret = fun.match(retRegExp)?.shift();

  if (!ret) {
    throw new Error("[CB] Failed to get the getClock return expression");
  }

  const expression = ret
    .split("return")
    .join("window.__bran_clock =")
    .split("}}")
    .join("; return window.__bran_clock }}");

  return playSource.replace(funRegExp, fun.replace(retRegExp, expression));
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
