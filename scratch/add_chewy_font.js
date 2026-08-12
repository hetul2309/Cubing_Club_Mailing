const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Add Chewy font link to head
const chewyFontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet">`;

if (!html.includes('family=Chewy')) {
  html = html.replace('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome', chewyFontLink + '\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome');
}

// 2. Update header title style to Chewy font
const oldTitleTag = `<p class="header-title" style="margin: 0; font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">🎉 Cubing Club's Workshop</p>`;
const newTitleTag = `<p class="header-title" style="margin: 0; font-family: 'Chewy', 'Trebuchet MS', 'Comic Sans MS', cursive, sans-serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 1px;">🎉 Cubing Club's Workshop</p>`;

html = html.replace(oldTitleTag, newTitleTag);

// 3. Adjust media query font-size for Chewy
html = html.replace('font-size: 22px !important;', 'font-size: 26px !important;');

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Applied Google Font "Chewy" to the heading in workshop.html!');
