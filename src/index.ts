import config from "./config";
import { startChromium } from "./chromium";
import server from "./server";

Promise.resolve().then(() => {
  server().listen(config.port, startChromium);
});
