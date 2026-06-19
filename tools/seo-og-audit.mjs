import { promises as fs } from "node:fs";
import path from "node:path";

const positional = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const root = path.resolve(positional[0] || process.cwd());
const includeNoindex = process.argv.includes("--include-noindex");
const summaryOnly = process.argv.includes("--summary");

const required = [
  "title",
  "meta description",
  "canonical",
  "og:title",
  "og:description",
  "og:image",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

const noindexPattern = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", ".next", "dist", "build"].includes(entry.name)) return [];
      return walk(full);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  }));
  return files.flat();
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function readAttrs(tag) {
  const attrs = {};
  tag.replace(/([:\w-]+)\s*=\s*(["'])(.*?)\2/g, (_, name, _quote, value) => {
    attrs[name.toLowerCase()] = value.trim();
    return "";
  });
  return attrs;
}

function collectMetadata(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => readAttrs(match[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => readAttrs(match[0]));
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";

  const meta = (name) => metas.some((attrs) => {
    const key = attrs.name || attrs.property;
    return key?.toLowerCase() === name && !!attrs.content;
  });

  const canonical = links.some((attrs) => {
    const rel = String(attrs.rel || "").toLowerCase().split(/\s+/);
    return rel.includes("canonical") && !!attrs.href;
  });

  return {
    "html lang": /<html\s+[^>]*lang=["'][^"']+["']/i.test(html),
    title: !!title,
    "meta description": meta("description"),
    canonical,
    "og:title": meta("og:title"),
    "og:description": meta("og:description"),
    "og:image": meta("og:image"),
    "twitter:card": meta("twitter:card"),
    "twitter:title": meta("twitter:title"),
    "twitter:description": meta("twitter:description"),
    "twitter:image": meta("twitter:image"),
  };
}

function auditHtml(html) {
  const noindex = noindexPattern.test(html);
  const metadata = collectMetadata(html);
  const missing = ["html lang", ...required].filter((label) => !metadata[label]);
  return { noindex, missing };
}

const htmlFiles = await walk(root);
const results = [];

for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  const result = auditHtml(html);
  if (!includeNoindex && result.noindex) continue;
  if (result.missing.length) {
    results.push({ file: relative(file), ...result });
  }
}

const totalIndexable = htmlFiles.length - (await Promise.all(htmlFiles.map(async (file) => {
  const html = await fs.readFile(file, "utf8");
  return noindexPattern.test(html) ? 1 : 0;
}))).reduce((sum, value) => sum + value, 0);

const counts = ["html lang", ...required].reduce((acc, label) => ({ ...acc, [label]: 0 }), {});
results.forEach((result) => {
  result.missing.forEach((label) => {
    counts[label] = (counts[label] || 0) + 1;
  });
});

console.log(`SEO/OG audit root: ${root}`);
console.log(`HTML files: ${htmlFiles.length}`);
console.log(`Indexable pages checked: ${includeNoindex ? htmlFiles.length : totalIndexable}`);
console.log(`Pages with missing metadata: ${results.length}`);

Object.entries(counts)
  .filter(([, count]) => count > 0)
  .sort((a, b) => b[1] - a[1])
  .forEach(([label, count]) => console.log(`${label}: ${count}`));

if (!summaryOnly && results.length) {
  console.log("");
  results.forEach((result) => {
    const flag = result.noindex ? " noindex" : "";
    console.log(`${result.file}${flag}`);
    console.log(`  missing: ${result.missing.join(", ")}`);
  });
}

process.exitCode = results.length ? 1 : 0;
