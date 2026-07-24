import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const routes = [
  ["dist/index.html", "https://markegididev.github.io/"],
  [
    "dist/dashboard/index.html",
    "https://markegididev.github.io/dashboard/",
  ],
  [
    "dist/swim-analyzer/index.html",
    "https://markegididev.github.io/swim-analyzer/",
  ],
];

const titles = new Set();
const descriptions = new Set();

for (const [file, canonicalUrl] of routes) {
  const html = await readFile(file, "utf8");
  const document = new JSDOM(html).window.document;
  const title = document.title.trim();
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content")
    ?.trim();
  const canonical = document
    .querySelector('link[rel="canonical"]')
    ?.getAttribute("href");
  const ogUrl = document
    .querySelector('meta[property="og:url"]')
    ?.getAttribute("content");

  assert.ok(title, `${file} must have a title`);
  assert.ok(description, `${file} must have a description`);
  assert.equal(canonical, canonicalUrl, `${file} canonical mismatch`);
  assert.equal(ogUrl, canonicalUrl, `${file} Open Graph URL mismatch`);
  assert.equal(
    document.querySelectorAll('meta[name="keywords"]').length,
    0,
    `${file} must not use meta keywords`,
  );

  titles.add(title);
  descriptions.add(description);
}

assert.equal(titles.size, routes.length, "Public route titles must be unique");
assert.equal(
  descriptions.size,
  routes.length,
  "Public route descriptions must be unique",
);

const homepage = new JSDOM(await readFile("dist/index.html", "utf8")).window
  .document;
const jsonLd = JSON.parse(
  homepage.querySelector("#structured-data")?.textContent ?? "{}",
);
const graphTypes = new Set(jsonLd["@graph"].map((item) => item["@type"]));
assert.ok(graphTypes.has("WebSite"), "JSON-LD must contain WebSite");
assert.ok(graphTypes.has("Person"), "JSON-LD must contain Person");
assert.ok(graphTypes.has("ProfilePage"), "JSON-LD must contain ProfilePage");

const person = jsonLd["@graph"].find((item) => item["@type"] === "Person");
assert.deepEqual(person.sameAs, [
  "https://github.com/markegidiDev",
  "https://www.linkedin.com/in/marcoegidi",
  "https://www.youtube.com/@markegidi",
]);

const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const [, canonicalUrl] of routes) {
  assert.ok(sitemap.includes(`<loc>${canonicalUrl}</loc>`));
}

const robots = await readFile("dist/robots.txt", "utf8");
assert.match(robots, /Allow:\s*\//);
assert.match(
  robots,
  /Sitemap:\s*https:\/\/markegididev\.github\.io\/sitemap\.xml/,
);
assert.doesNotMatch(robots, /Disallow:\s*\//);

const ogImage = await readFile("dist/og-marco-egidi.png");
assert.equal(ogImage.toString("ascii", 1, 4), "PNG");
assert.equal(ogImage.readUInt32BE(16), 1200);
assert.equal(ogImage.readUInt32BE(20), 630);

for (const resumePath of [
  "dist/Marco_Egidi_CV_EN_updated.pdf",
  "dist/Marco_Egidi_CV_IT_updated.pdf",
]) {
  const resume = await readFile(resumePath);
  assert.equal(resume.toString("ascii", 0, 4), "%PDF");
}

const homeSource = await readFile("src/pages/HomePage.tsx", "utf8");
assert.equal((homeSource.match(/<h1\b/g) ?? []).length, 1);

console.log("SEO verification passed for metadata, canonicals, JSON-LD, assets, sitemap, and robots.");
