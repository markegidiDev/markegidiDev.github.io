import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const indexPath = resolve(root, "dist", "index.html");
const source = await readFile(indexPath, "utf8");

const routes = [
  {
    directory: "dashboard",
    title: "Swimming Data Dashboard | Marco Egidi",
    description:
      "A personal swimming data dashboard by Marco Egidi, combining activity metrics, pace analysis, and software development.",
    canonical: "https://markegididev.github.io/dashboard/",
  },
  {
    directory: "swim-analyzer",
    title: "Swim Analyzer — Swimming Data Analysis | Marco Egidi",
    description:
      "Analyse swimming race segments, World Aquatics points, pacing, stroke metrics, and performance scenarios with Marco Egidi’s Swim Analyzer.",
    canonical: "https://markegididev.github.io/swim-analyzer/",
  },
];

for (const route of routes) {
  let html = source;
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`,
  );
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${route.description}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${route.canonical}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${route.title}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${route.description}" />`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${route.canonical}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${route.description}" />`,
  );

  const outputDirectory = resolve(root, "dist", route.directory);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, "index.html"), html, "utf8");
}
