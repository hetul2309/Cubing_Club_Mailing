const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Updated Mobile Responsive Media Query
const newMobileStyle = `  <style type="text/css">
    /* Reset & Client-Specific Styles */
    html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; max-width: 100%; }
    * { box-sizing: border-box; }
    
    /* Mobile Responsive Media Query */
    @media only screen and (max-width: 600px) {
      .outer-wrapper {
        padding: 10px 0 !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
      .content-padding {
        padding-left: 14px !important;
        padding-right: 14px !important;
      }
      .header-title {
        font-size: 22px !important;
        letter-spacing: 0.5px !important;
        line-height: 1.3 !important;
      }
      .column-third {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 12px !important;
      }
      .column-half {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 10px !important;
      }
      .sched-row-cell {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        padding: 4px 0 !important;
        box-sizing: border-box !important;
      }
    }
  </style>`;

// Replace <style type="text/css">...</style> block
html = html.replace(/<style type="text\/css">[\s\S]*?<\/style>/g, newMobileStyle);

// 2. Add outer-wrapper class to top outer table
html = html.replace('style="background-color: #f0f2f5; padding: 30px 0;"', 'class="outer-wrapper" style="background-color: #f0f2f5; padding: 30px 0;"');

// 3. Update Schedule Table Rows to avoid rigid cell percentage widths on mobile
html = html.replace(/width: 45%;/g, 'width: 40%;');
html = html.replace(/width: 25%;/g, 'width: 30%;');

// Replace sched-cell classes to sched-row-cell
html = html.replace(/class="sched-cell"/g, 'class="sched-row-cell"');
html = html.replace(/class="sched-cell-right"/g, 'class="sched-row-cell"');

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Updated mobile responsiveness and eliminated overflow/cutting off in workshop.html!');
