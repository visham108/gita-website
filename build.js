#!/usr/bin/env node
/* Bakes the shared header/footer into every page so the site works without
   JavaScript and crawlers see the full chrome.
   Usage: node build.js   (idempotent — run after editing partials/) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGES = {
  'index.html': 'home',
  'book.html': 'book',
  'explorer.html': 'explorer',
  'course.html': 'course',
  'resources.html': 'resources',
  'account.html': 'account',
  'checkout.html': 'checkout',
  '404.html': null
};

const header = fs.readFileSync(path.join(ROOT, 'partials', 'header.html'), 'utf8').trim();
const footer = fs.readFileSync(path.join(ROOT, 'partials', 'footer.html'), 'utf8').trim();

function inject(html, marker, replacement) {
  const open = `<!-- chrome:${marker} -->`;
  const close = `<!-- /chrome:${marker} -->`;
  const start = html.indexOf(open);
  const end = html.indexOf(close);
  if (start === -1 || end === -1) throw new Error(`missing ${marker} markers`);
  return html.slice(0, start + open.length) + '\n' + replacement + '\n' + html.slice(end);
}

for (const [file, pageId] of Object.entries(PAGES)) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) { console.warn(`skip ${file} (not found)`); continue; }
  let html = fs.readFileSync(fp, 'utf8');
  let pageHeader = header;
  if (pageId) {
    pageHeader = pageHeader.replace(`data-nav-id="${pageId}"`, `data-nav-id="${pageId}" aria-current="page"`);
  }
  html = inject(html, 'header', pageHeader);
  html = inject(html, 'footer', footer);
  fs.writeFileSync(fp, html);
  console.log(`baked ${file}${pageId ? ` (current: ${pageId})` : ''}`);
}
