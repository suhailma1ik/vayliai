import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("ERROR", e.message));
await page.goto("http://127.0.0.1:4321/app/history?demo=1");
await page.waitForTimeout(1000);
console.log(await page.locator("body").innerText());
await browser.close();
