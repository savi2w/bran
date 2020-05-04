import bent from "bent";
import fs from "fs-extra";
import path from "path";
import puppeteer from "puppeteer-core";

const getSource = bent("string");

const cliPattern = /live\.client\.[a-f0-9]{8,8}\.js/g;
const encPattern = /function encodeTCN\((.*?)\){(.*?)return (.*?)}/g;
const decPattern = /function decodeTCN\((.*?)\){(.*?)return (.*?)}/g;
const postPattern = /function post\((.*?)\){/g;

const useInterceptMove = (history: string) =>
  `const moveEvent=new window.CustomEvent("INTERCEPT_MOVE",{detail:{encode:encodeTCN,history:${history}}});window.dispatchEvent(moveEvent);`;

const useClientId =
  "try{window.CLIENT_ID=JSON.parse(arguments[0].body)[0].clientId;}catch(err){}";

const defaultRespond = {
  status: 200,
  contentType: "application/javascript; charset=utf-8",
};

const useCustomClient = async (request: puppeteer.Request) => {
  const url = request.url();
  if (cliPattern.test(url)) {
    const cli = url.split("/").pop();
    if (!cli) {
      throw new TypeError('"cli" must be a string');
    }

    const cliPath = path.join("/app", cli);
    const cliExists = await fs.pathExists(cliPath);
    if (cliExists) {
      return request.respond({
        ...defaultRespond,
        body: await fs.readFile(cliPath),
      });
    }

    const cliSource = await getSource(url);
    const encSource = cliSource.match(encPattern);
    if (!encSource) {
      throw new TypeError('"encSource" must be a RegExpMatchArray');
    }

    const encReplaced = cliSource.split(encSource[0]).join("encodeTCN");
    const decSource = encReplaced.match(decPattern);
    if (!decSource) {
      throw new TypeError('"decSource" must be a RegExpMatchArray');
    }

    const history = decSource[0].split("return ")[1].split("}").join("");
    const decReplaced = encReplaced
      .split(decSource[0])
      .join(
        encSource[0] +
          decSource[0]
            .split("return")
            .join(useInterceptMove(history) + "return")
      );

    const postSource = decReplaced.match(postPattern);
    if (!postSource) {
      throw new TypeError("postSource must be a RegExpMatchArray");
    }

    const postReplaced = decReplaced
      .split(postSource[0])
      .join(postSource[0] + useClientId);

    return Promise.all([
      request.respond({
        ...defaultRespond,
        body: postReplaced,
      }),
      fs.writeFile(cliPath, postReplaced),
    ]);
  }

  return request.continue();
};

const requestMiddleware = (request: puppeteer.Request) =>
  Promise.all([useCustomClient(request)]);

export default requestMiddleware;
