const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
const imagesDir = path.join(__dirname, '..', 'images');

let html = fs.readFileSync(htmlPath, 'utf-8');

// Use SMALL JPEG versions of puzzle images (3-6KB each vs 58-196KB PNG)
// Use existing small PNG social icons (5-16KB each)
// Together: ~82KB total HTML - well under Gmail's 102KB clipping limit

const embed = (filename, mime) => {
  const buf = fs.readFileSync(path.join(imagesDir, filename));
  return `data:${mime};base64,${buf.toString('base64')}`;
};

// Replace relative paths with base64 data URIs
// NOTE: Logo is intentionally excluded — at 55KB base64 it alone pushes HTML over
//       Gmail's 102KB clipping limit. The text signature remains for branding.
html = html
  .replace(/src=["']images\/3x3_image_modern\.png["']/g,   `src="${embed('3x3_image.jpg', 'image/jpeg')}"`)
  .replace(/src=["']images\/2x2_image_modern\.png["']/g,   `src="${embed('2x2_image.jpg', 'image/jpeg')}"`)
  .replace(/src=["']images\/pyra_image_modern\.png["']/g,  `src="${embed('pyra_image.jpg', 'image/jpeg')}"`)
  .replace(/src=["']images\/instagram_logo\.png["']/g,     `src="${embed('instagram_logo.png', 'image/png')}"`)
  .replace(/src=["']images\/youtube_logo\.png["']/g,       `src="${embed('youtube_logo.png', 'image/png')}"`)
  .replace(/src=["']images\/linkedin_logo\.png["']/g,      `src="${embed('linkedin_logo.png', 'image/png')}"`)
  // Remove logo img tag entirely (replaced by "The Cubing Club, DAU" text signature above it)
  .replace(/<img[^>]+src=["']images\/cubing_club_logo\.jpg["'][^>]*\/>/g, '');


const finalSize = Buffer.byteLength(html, 'utf-8');
const sizeKB = (finalSize / 1024).toFixed(1);

fs.writeFileSync(htmlPath, html, 'utf-8');

console.log(`✅ workshop.html rebuilt with embedded images.`);
console.log(`   Total HTML size: ${sizeKB} KB`);
if (finalSize > 102400) {
  console.warn(`   ⚠️  WARNING: ${sizeKB} KB exceeds Gmail's 102 KB clipping limit!`);
} else {
  console.log(`   ✅ Under Gmail's 102 KB limit — message will NOT be clipped.`);
}
