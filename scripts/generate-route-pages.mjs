import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(root, "index.html"), "utf8");

const routes = [
  ["/work/olive", "Olive", "I worked on Olive as co-founder & CTO, building AI-native internal tools and consumer apps."],
  ["/work/campsite", "Campsite", "I interned at Campsite, a five-person team building an async communication platform for deep work."],
  ["/work/nasa", "NASA", "I worked on satellite imagery and server-side analysis for NASA's SmallSat Data Acquisition team."],
  ["/work/fundsy", "Fundsy", "I founded Fundsy with my best friends to help community projects manage donations, budgets, cards, and reimbursements."],
  ["/work/irvine-lights", "Irvine Lights", "I started Irvine Lights in high school and grew it into a student-run nonprofit across Irvine."],
  ["/work/capital-one", "Capital One", "At Capital One, I helped automate Surprise & Delight gifts for call center customers."],
  ["/projects", "Projects", "A collection of projects I've built, from social apps and campus tools to home networking."],
  ["/projects/yappin", "Yappin", "Yappin was an anonymous iOS group chat for everyone physically around you."],
  ["/projects/phinances", "Phinances", "I built Phinances to manage dues, reimbursements, budgets, and bank balances for college organizations."],
  ["/projects/davis-parking", "Davis Parking", "I built a one-click parking payment experiment and responsibly disclosed a major refund vulnerability."],
  ["/projects/aggieworks", "AggieWorks", "I led AggieWorks, a product and engineering club that launched five apps for UC Davis students."],
  ["/projects/katamundi", "Katamundi", "Katamundi was my first software internship, when Bardia and I were 15."],
  ["/projects/home-networking", "Home Networking", "I rebuilt my house's network with cheap Ubiquiti hardware and access points in every room."],
  ["/projects/zoom-bookmarks", "Zoom Bookmarks", "I built a Chrome extension that kept every class's Zoom link one click away."]
];

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceOne(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Missing ${label} in index.html`);
  return html.replace(pattern, replacement);
}

for (const [path, title, description] of routes) {
  const pageTitle = `${title} | Shrey Gupta`;
  const canonical = `https://shreygups.com${path}`;
  const escapedTitle = escapeAttribute(pageTitle);
  const escapedDescription = escapeAttribute(description);
  const escapedCanonical = escapeAttribute(canonical);

  let html = source;
  html = replaceOne(html, /<title>[^<]*<\/title>/, `<title>${escapedTitle}</title>`, "title");
  html = replaceOne(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapedDescription}">`, "description");
  html = replaceOne(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapedCanonical}">`, "canonical URL");
  html = replaceOne(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapedTitle}">`, "Open Graph title");
  html = replaceOne(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapedDescription}">`, "Open Graph description");
  html = replaceOne(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapedCanonical}">`, "Open Graph URL");
  html = replaceOne(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapedTitle}">`, "X title");
  html = replaceOne(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapedDescription}">`, "X description");

  const output = resolve(root, `${path.slice(1)}.html`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
  console.log(path);
}

let notFound = source;
notFound = replaceOne(notFound, /<title>[^<]*<\/title>/, "<title>Not Found | Shrey Gupta</title>", "404 title");
notFound = replaceOne(notFound, /<meta name="description" content="[^"]*">/, '<meta name="description" content="This page does not exist.">', "404 description");
notFound = replaceOne(notFound, /<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, follow">', "404 robots policy");
await writeFile(resolve(root, "404.html"), notFound);
console.log("/404.html");
