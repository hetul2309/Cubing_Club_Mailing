const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Replace any data URIs or relative paths with clean CIDs for Nodemailer inline rendering
const imgMatches = [];
const regex = /src=["'](?:data:image\/[^"']+|images\/[^"']+)["']/g;
let m;
while ((m = regex.exec(html)) !== null) {
  imgMatches.push({ index: m.index, length: m[0].length });
}

console.log('Found image tags count:', imgMatches.length);

// Also check if logo tag is present under signature
if (!html.includes('src="cid:cubing_club_logo"')) {
  const sigEnd = `<p style="margin: 0 0 16px 0; font-size: 16px; color: #e63946; font-weight: bold;">
                The Cubing Club, DAU
              </p>`;
  const logoTag = `\n              <!-- Club Logo After Signature -->\n              <img src="cid:cubing_club_logo" alt="The Cubing Club, DAU Logo" style="max-width: 110px; width: 100%; height: auto; display: block; margin-top: 8px; border: 0;" />`;
  html = html.replace(sigEnd, sigEnd + logoTag);
}

// Ensure 3x3, 2x2, pyra, instagram, youtube, linkedin use CIDs
html = html
  .replace(/src=["'](?:data:image\/[^"']+|images\/3x3_image[^"']+)["']/g, 'src="cid:3x3_image"')
  .replace(/src=["'](?:data:image\/[^"']+|images\/2x2_image[^"']+)["']/g, 'src="cid:2x2_image"')
  .replace(/src=["'](?:data:image\/[^"']+|images\/pyra_image[^"']+)["']/g, 'src="cid:pyra_image"')
  .replace(/src=["'](?:data:image\/[^"']+|images\/instagram_logo[^"']+)["']/g, 'src="cid:instagram_logo"')
  .replace(/src=["'](?:data:image\/[^"']+|images\/youtube_logo[^"']+)["']/g, 'src="cid:youtube_logo"')
  .replace(/src=["'](?:data:image\/[^"']+|images\/linkedin_logo[^"']+)["']/g, 'src="cid:linkedin_logo"');

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Updated workshop.html to use CID image tags. Size:', html.length, 'bytes');
