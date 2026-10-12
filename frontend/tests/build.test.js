import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const pages = [
  "index.html",
  ...[
    "login",
    "register",
    "pets",
    "rooms",
    "bookings",
    "checkout",
    "staff-dashboard",
  ].map((p) => `pages/${p}.html`),
];
test("all eight built pages resolve static navigation and local assets", async () => {
  for (const page of pages) {
    const html = await readFile(
      new URL(`../dist/${page}`, import.meta.url),
      "utf8",
    );
    assert.ok(!html.includes("<!-- include:"), `${page}: unresolved partial`);
    for (const [, link] of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
      if (!link.startsWith("/")) continue;
      const pathname = new URL(link, "http://localhost").pathname;
      await access(
        new URL(
          `../dist${pathname === "/" ? "/index.html" : pathname}`,
          import.meta.url,
        ),
      );
    }
  }
});
