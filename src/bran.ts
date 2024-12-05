import path from "path";

import { launch } from "./application/chrome";
import { useHijackedClient } from "./application/middleware/hijack";
import { server } from "./back-end/server";

const link =
  "https://www.chess.com/login_and_go?returnUrl=https://www.chess.com/play/online";

const startClient = async () => {
  const page = await launch();

  await page.setRequestInterception(true);

  page.on("domcontentloaded", async () => {
    await page.addScriptTag({
      path: require.resolve(path.join(__dirname, "inject", "emitter.js")),
    });
  });

  page.on("domcontentloaded", async () => {
    await page.addScriptTag({
      path: require.resolve(path.join(__dirname, "inject", "listener.3.js")),
    });
  });

  page.on("request", useHijackedClient());

  await page.goto(link);
};

Promise.resolve().then(async () => {
  server().listen(3069, startClient);
});
