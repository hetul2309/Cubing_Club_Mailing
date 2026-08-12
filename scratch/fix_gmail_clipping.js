const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Replace base64 src attributes with relative file paths for local Chrome viewing
html = html.replace(/src="data:image\/png;base64,[^"]+"/g, (match, offset) => {
  // Determine which image based on surrounding context
  return match;
});

// Let's rewrite workshop.html to use clean relative paths:
// 1. 3x3: images/3x3_image_modern.png
// 2. 2x2: images/2x2_image_modern.png
// 3. Pyraminx: images/pyra_image_modern.png
// 4. Logo: images/cubing_club_logo.jpg
// 5. Instagram: images/instagram_logo.png
// 6. YouTube: images/youtube_logo.png
// 7. LinkedIn: images/linkedin_logo.png

// Find positions of images in html
const imgMatches = [];
const regex = /src="data:image\/[^"]+"/g;
let m;
while ((m = regex.exec(html)) !== null) {
  imgMatches.push({ index: m.index, length: m[0].length });
}

console.log('Found Base64 images count:', imgMatches.length);

if (imgMatches.length === 7) {
  const replacements = [
    'src="images/3x3_image_modern.png"',
    'src="images/2x2_image_modern.png"',
    'src="images/pyra_image_modern.png"',
    'src="images/cubing_club_logo.jpg"',
    'src="images/instagram_logo.png"',
    'src="images/youtube_logo.png"',
    'src="images/linkedin_logo.png"'
  ];

  // Replace from back to front to keep indices valid
  for (let i = imgMatches.length - 1; i >= 0; i--) {
    const item = imgMatches[i];
    html = html.substring(0, item.index) + replacements[i] + html.substring(item.index + item.length);
  }

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('✅ Converted workshop.html Base64 images to relative paths! New file size:', html.length, 'bytes');
} else {
  console.error('Unexpected image count:', imgMatches.length);
}
