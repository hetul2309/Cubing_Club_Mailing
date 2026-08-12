const fs = require('fs');
const path = require('path');

// 1. Update workshop.html image src tags
const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

html = html
  .replace(/src=["'](?:cid:3x3_image|images\/3x3_image\.jpg)["']/g, 'src="images/3x3_image_modern.png"')
  .replace(/src=["'](?:cid:2x2_image|images\/2x2_image\.jpg)["']/g, 'src="images/2x2_image_modern.png"')
  .replace(/src=["'](?:cid:pyra_image|images\/pyra_image\.jpg)["']/g, 'src="images/pyra_image_modern.png"')
  .replace(/src=["'](?:cid:cubing_club_logo|images\/cubing_club_logo\.jpg)["']/g, 'src="images/cubing_club_logo.jpg"')
  .replace(/src=["'](?:cid:instagram_logo|images\/instagram_logo\.png)["']/g, 'src="images/instagram_logo.png"')
  .replace(/src=["'](?:cid:youtube_logo|images\/youtube_logo\.png)["']/g, 'src="images/youtube_logo.png"')
  .replace(/src=["'](?:cid:linkedin_logo|images\/linkedin_logo\.png)["']/g, 'src="images/linkedin_logo.png"');

fs.writeFileSync(htmlPath, html, 'utf-8');

// 2. Synchronize emails/images/ directory to contain only the 7 exact files from images/
const srcDir = path.join(__dirname, '..', 'images');
const destDir = path.join(__dirname, '..', 'emails', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Clean old files in emails/images/
fs.readdirSync(destDir).forEach(file => {
  fs.unlinkSync(path.join(destDir, file));
});

// Copy exact 7 files
fs.readdirSync(srcDir).forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

console.log('✅ Synchronized workshop.html and emails/images/ with the exact 7 files from images/!');
