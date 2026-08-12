const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'images', 'cubing_club_logo.jpg');
const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');

if (fs.existsSync(logoPath)) {
  const logoBuf = fs.readFileSync(logoPath);
  const logoBase64 = 'data:image/jpeg;base64,' + logoBuf.toString('base64');
  let html = fs.readFileSync(htmlPath, 'utf-8');
  html = html.replace('src="cid:cubing_club_logo"', `src="${logoBase64}"`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('✅ Replaced cid:cubing_club_logo with Base64 Data URI in workshop.html');
} else {
  console.error('Logo file not found:', logoPath);
}
