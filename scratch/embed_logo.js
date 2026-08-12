const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, 'images', 'cubing_club_logo.jpg');
if (fs.existsSync(logoPath)) {
  const logoBuf = fs.readFileSync(logoPath);
  const logoBase64 = 'data:image/jpeg;base64,' + logoBuf.toString('base64');
  const htmlPath = path.join(__dirname, 'emails', 'workshop.html');
  let html = fs.readFileSync(htmlPath, 'utf-8');
  html = html.replace('src="cid:cubing_club_logo"', `src="${logoBase64}"`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('Done converting logo to Base64 in workshop.html');
}
