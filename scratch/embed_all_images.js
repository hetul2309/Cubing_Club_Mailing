const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');
const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');

let html = fs.readFileSync(htmlPath, 'utf-8');

const imageMapping = [
  { cid: 'cid:img_3x3', file: '3x3_image_modern.png', mime: 'image/png' },
  { cid: 'cid:img_2x2', file: '2x2_image_modern.png', mime: 'image/png' },
  { cid: 'cid:img_pyra', file: 'pyra_image_modern.png', mime: 'image/png' },
  { cid: 'cid:instagram_logo', file: 'instagram_logo.png', mime: 'image/png' },
  { cid: 'cid:youtube_logo', file: 'youtube_logo.png', mime: 'image/png' },
  { cid: 'cid:linkedin_logo', file: 'linkedin_logo.png', mime: 'image/png' },
];

imageMapping.forEach(img => {
  const filePath = path.join(imagesDir, img.file);
  if (fs.existsSync(filePath)) {
    const buf = fs.readFileSync(filePath);
    const base64Str = `data:${img.mime};base64,` + buf.toString('base64');
    html = html.split(img.cid).join(base64Str);
    console.log(`Embedded ${img.file} (${buf.length} bytes)`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
});

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Successfully converted all images to Base64 Data URIs in workshop.html');
