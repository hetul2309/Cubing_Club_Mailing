const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Add .column-half-last class definition to mobile media query in <head>
if (!html.includes('.column-half-last')) {
  const oldHalfCss = `.column-half {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 10px !important;
      }`;

  const newHalfCss = `.column-half {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 10px !important;
      }
      .column-half-last {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 0 !important;
      }`;

  html = html.replace(oldHalfCss, newHalfCss);
}

// 2. Update Batch 2023 cell to use class="column-half-last"
html = html.replace(
  '<td width="50%" class="column-half" style="padding: 0 0 0 6px;" align="center">\n                          <a href="https://chat.whatsapp.com/BrDTAOd0uCi6OP4zuPDLp2?s=qt&p=a&ilr=4" target="_blank"\n                            style="display: inline-block; background-color: #25D366; color: #ffffff;\n                              font-size: 14px; font-weight: bold; text-decoration: none;\n                              padding: 12px 20px; border-radius: 8px; width: 100%;\n                              box-sizing: border-box; text-align: center;">\n                            Join Batch 2023',
  '<td width="50%" class="column-half-last" style="padding: 0 0 0 5px;" align="center">\n                          <a href="https://chat.whatsapp.com/BrDTAOd0uCi6OP4zuPDLp2?s=qt&p=a&ilr=4" target="_blank"\n                            style="display: inline-block; background-color: #25D366; color: #ffffff;\n                              font-size: 14px; font-weight: bold; text-decoration: none;\n                              padding: 12px 20px; border-radius: 8px; width: 100%;\n                              box-sizing: border-box; text-align: center;">\n                            Join Batch 2023'
);

// 3. Make desktop padding uniform (5px/10px spacing)
html = html.replace('style="padding: 0 6px 10px 0;"', 'style="padding: 0 5px 10px 0;"');
html = html.replace('style="padding: 0 0 10px 6px;"', 'style="padding: 0 0 10px 5px;"');
html = html.replace('style="padding: 0 6px 0 0;"', 'style="padding: 0 5px 0 0;"');

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Adjusted WhatsApp Join Batch buttons for equal spacing on mobile and desktop!');
