const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const regex = /<img[^>]+src=["']([^"']+)["']/g;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null) {
  count++;
  const src = match[1];
  console.log(`Image ${count}: alt="${match[0].match(/alt=["']([^"']+)["']/)?.[1]}" -> src starts with: ${src.substring(0, 35)}...`);
}
