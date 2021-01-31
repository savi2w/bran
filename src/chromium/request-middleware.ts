import bent from "bent";
import puppeteer from "puppeteer-core";

const getSource = bent("string");

const clientPattern = /live__stable\.client\.[a-f0-9]{8}\.js/g;
const encodePattern = /function encodeTCN\((.*?)\){(.*?)return (.*?)}/g;
const decodePattern = /function decodeTCN\((.*?)\){(.*?)return (.*?)}/g;
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
  if (clientPattern.test(url)) {
    const client = url.split("/").pop();
    if (!client) {
      throw new TypeError('"client" should be a string');
    }

    const clientSource = await getSource(url);
    const encodeSource = clientSource.match(encodePattern);
    if (!encodeSource) {
      throw new TypeError('"encodeSource" should be a RegExpMatchArray');
    }

    const encodeReplaced = clientSource
      .split(encodeSource[0])
      .join("encodeTCN");

    const decodeSource = encodeReplaced.match(decodePattern);
    if (!decodeSource) {
      throw new TypeError('"decodeSource" should be a RegExpMatchArray');
    }

    const history = decodeSource[0].split("return ")[1].split("}").join("");
    const decodeReplaced = encodeReplaced
      .split(decodeSource[0])
      .join(
        encodeSource[0] +
          decodeSource[0]
            .split("return")
            .join(useInterceptMove(history) + "return")
      );

    const postSource = decodeReplaced.match(postPattern);
    if (!postSource) {
      throw new TypeError("postSource should be a RegExpMatchArray");
    }

    const postReplaced = decodeReplaced
      .split(postSource[0])
      .join(postSource[0] + useClientId);

    return request.respond({
      ...defaultRespond,
      body: postReplaced,
    });
  }

  return request.continue();
};

const requestMiddleware = (request: puppeteer.Request): Promise<void[]> =>
  Promise.all([useCustomClient(request)]);

export default requestMiddleware;
