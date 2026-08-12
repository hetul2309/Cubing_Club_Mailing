const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Update font link to Chango
const oldFontLink = `<link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet">`;
const newFontLink = `<link href="https://fonts.googleapis.com/css2?family=Chango&family=Chewy&display=swap" rel="stylesheet">`;

html = html.replace(oldFontLink, newFontLink);

// 2. Update header title style to Chango font
const oldTitleTag = `<p class="header-title" style="margin: 0; font-family: 'Chewy', 'Trebuchet MS', 'Comic Sans MS', cursive, sans-serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 1px;">🎉 Cubing Club's Workshop</p>`;
const newTitleTag = `<p class="header-title" style="margin: 0; font-family: 'Chango', 'Chewy', 'Trebuchet MS', cursive, sans-serif; font-size: 24px; font-weight: 400; color: #ffffff; letter-spacing: 0.5px;">🎉 Cubing Club's Workshop</p>`;

html = html.replace(oldTitleTag, newTitleTag);

// 3. Adjust mobile responsive title size
html = html.replace('font-size: 26px !important;', 'font-size: 20px !important;');

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Applied Google Font "Chango" to the heading in workshop.html!');
