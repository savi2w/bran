import { Launcher } from "chrome-launcher";
import puppeteer, { Page } from "puppeteer-core";

export const launch = async (): Promise<Page> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    defaultViewport: null,
    executablePath: Launcher.getFirstInstallation(),
    headless: false,
  });

  return browser.newPage();
};
