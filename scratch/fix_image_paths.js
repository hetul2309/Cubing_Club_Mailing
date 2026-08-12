const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Fix 3x3, 2x2, and Pyraminx card image tags to use distinct, relative image paths
html = html.replace(
  /<img src="cid:3x3_image" alt="3x3 Rubik's Cube"/g,
  '<img src="images/3x3_image.jpg" alt="3x3 Rubik\'s Cube"'
);

html = html.replace(
  /<img src="cid:3x3_image" alt="2x2 Rubik's Cube"/g,
  '<img src="images/2x2_image.jpg" alt="2x2 Rubik\'s Cube"'
);

html = html.replace(
  /<img src="cid:3x3_image" alt="Pyraminx Puzzle"/g,
  '<img src="images/pyra_image.jpg" alt="Pyraminx Puzzle"'
);

// 2. Fix Logo and Social Icons relative paths
html = html
  .replace(/src="cid:cubing_club_logo"/g, 'src="images/cubing_club_logo.jpg"')
  .replace(/src="cid:instagram_logo"/g, 'src="images/instagram_logo.png"')
  .replace(/src="cid:youtube_logo"/g, 'src="images/youtube_logo.png"')
  .replace(/src="cid:linkedin_logo"/g, 'src="images/linkedin_logo.png"');

fs.writeFileSync(htmlPath, html, 'utf-8');

// 3. Ensure emails/images/ contains all 7 images so double-clicking workshop.html in Chrome displays all images
const srcDir = path.join(__dirname, '..', 'images');
const destDir = path.join(__dirname, '..', 'emails', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

console.log('✅ Updated workshop.html image src tags and synchronized images/ to emails/images/!');
