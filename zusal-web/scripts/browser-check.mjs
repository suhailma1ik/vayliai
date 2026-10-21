import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE,
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
});
const securityHeaders = await readFile("dist/_headers", "utf8");
const policy = securityHeaders.match(/Content-Security-Policy: (.+)/)?.[1];
assert.ok(policy, "Built CSP is required");
await context.route(
  (process.env.TEST_BASE_URL ?? "http://127.0.0.1:4322") + "/**",
  async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        ...(response.headers()["content-type"]?.includes("text/html")
          ? { "Content-Security-Policy": policy }
          : {}),
      },
    });
  },
);
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const results = [];
try {
  for (const path of [
    "/",
    "/download",
    "/pricing",
    "/docs",
    "/sign-in",
    "/app/demo",
    "/app/history?demo=1",
    "/app/billing?demo=1",
    "/app/settings?demo=1",
  ]) {
    await page.goto(
      (process.env.TEST_BASE_URL ?? "http://127.0.0.1:4322") + path,
    );
    await page.locator("h1").first().waitFor();
    await page.waitForTimeout(250);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    results.push({
      path,
      overflow,
      violations: accessibility.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        targets: v.nodes.map((n) => n.target),
      })),
    });
    if (path === "/")
      await page.screenshot({
        path: "artifacts/home-desktop.png",
        fullPage: true,
      });
    if (path === "/app/demo") {
      await page.screenshot({
        path: "artifacts/dashboard-desktop.png",
        fullPage: true,
      });
      await page.getByRole("button", { name: "Today", exact: true }).click();
      await page
        .getByRole("button", { name: "Last 7 days", exact: true })
        .click();
    }
    if (path.startsWith("/app/history")) {
      await page.getByLabel("Status", { exact: true }).selectOption("failed");
      assert.ok(await page.getByText("Failed", { exact: true }).count());
      const download = page.waitForEvent("download");
      await page
        .getByRole("button", { name: "Export CSV", exact: true })
        .click();
      assert.equal((await download).suggestedFilename(), "zusal-requests.csv");
      await page
        .getByRole("button", { name: /example/ })
        .first()
        .click();
      await page.getByText("Routing reason", { exact: true }).waitFor();
    }
  }
  await page.goto((process.env.TEST_BASE_URL ?? "http://127.0.0.1:4322") + "/");
  await page.getByRole("button", { name: /theme/i }).click();
  await page.screenshot({ path: "artifacts/home-dark.png", fullPage: true });
  for (const path of ["/", "/pricing", "/app/demo", "/app/settings?demo=1"]) {
    await page.goto(
      (process.env.TEST_BASE_URL ?? "http://127.0.0.1:4322") + path,
    );
    await page.locator("h1").first().waitFor();
    const a11y = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    results.push({
      path: "dark:" + path,
      overflow: false,
      violations: a11y.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/",
    "/pricing",
    "/app/demo",
    "/app/history?demo=1",
    "/sign-in",
  ]) {
    await page.goto(
      (process.env.TEST_BASE_URL ?? "http://127.0.0.1:4322") + path,
    );
    await page.locator("h1").first().waitFor();
    await page.waitForTimeout(200);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Mobile overflow: " + path,
    );
    if (path === "/" || path === "/app/demo")
      await page.screenshot({
        path:
          path === "/"
            ? "artifacts/home-mobile.png"
            : "artifacts/dashboard-mobile.png",
        fullPage: true,
      });
  }
  await writeFile(
    "artifacts/browser-results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify({ results, errors }, null, 2));
  assert.equal(errors.length, 0);
  assert.equal(
    results.flatMap((r) => r.violations).length,
    0,
    "Accessibility issues",
  );
} finally {
  await browser.close();
}
