const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Add responsive CSS block in head
const responsiveStyle = `  <style type="text/css">
    /* Reset & Client-Specific Styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Mobile Responsive Media Query */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
      .content-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .header-title {
        font-size: 22px !important;
        letter-spacing: 0.5px !important;
      }
      .column-third {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 12px !important;
        box-sizing: border-box !important;
      }
      .column-half {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 10px !important;
        box-sizing: border-box !important;
      }
      .sched-cell {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        padding: 2px 0 !important;
      }
      .sched-cell-right {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        padding: 2px 0 !important;
        color: #f4a261 !important;
      }
    }
  </style>`;

// Add style to head if not present
if (!html.includes('Mobile Responsive Media Query')) {
  html = html.replace('</head>', responsiveStyle + '\n</head>');
}

// 2. Add classes to main email container
html = html.replace(
  'style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.12);"',
  'class="email-container" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.12);"'
);

// 3. Add class to title text
html = html.replace(
  `style="margin: 0; font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">🎉 Cubing Club's Workshop</p>`,
  `class="header-title" style="margin: 0; font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">🎉 Cubing Club's Workshop</p>`
);

// 4. Add content-padding class to body TD
html = html.replace(
  '<td style="padding: 32px 36px 0 36px;">',
  '<td class="content-padding" style="padding: 32px 36px 0 36px;">'
);

// 5. Add content-padding class to WhatsApp TD
html = html.replace(
  '<td style="padding: 0 36px 32px 36px;">',
  '<td class="content-padding" style="padding: 0 36px 32px 36px;">'
);

// 6. Add column-third class to 3 puzzle TDs
html = html.replace(
  '<td width="33%" style="padding: 0 6px 0 0;">',
  '<td width="33%" class="column-third" style="padding: 0 6px 0 0;">'
);
html = html.replace(
  '<td width="33%" style="padding: 0 3px;">',
  '<td width="33%" class="column-third" style="padding: 0 3px;">'
);
html = html.replace(
  '<td width="33%" style="padding: 0 0 0 6px;">',
  '<td width="33%" class="column-third" style="padding: 0 0 0 6px;">'
);

// 7. Add column-half class to 4 WhatsApp batch TDs
html = html.replace(
  '<td width="50%" style="padding: 0 6px 10px 0;" align="center">',
  '<td width="50%" class="column-half" style="padding: 0 6px 10px 0;" align="center">'
);
html = html.replace(
  '<td width="50%" style="padding: 0 0 10px 6px;" align="center">',
  '<td width="50%" class="column-half" style="padding: 0 0 10px 6px;" align="center">'
);
html = html.replace(
  '<td width="50%" style="padding: 0 6px 0 0;" align="center">',
  '<td width="50%" class="column-half" style="padding: 0 6px 0 0;" align="center">'
);
html = html.replace(
  '<td width="50%" style="padding: 0 0 0 6px;" align="center">',
  '<td width="50%" class="column-half" style="padding: 0 0 0 6px;" align="center">'
);

// 8. Add mobile sched-cell classes to schedule breakdown rows
html = html.replace(
  `<td style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">`,
  `<td class="sched-cell" style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">`
);
html = html.replace(
  `<td style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">`,
  `<td class="sched-cell" style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">`
);
html = html.replace(
  `<td style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">`,
  `<td class="sched-cell-right" style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">`
);

// Do it for row 2
html = html.replace(
  `<td style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">`,
  `<td class="sched-cell" style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">`
);
html = html.replace(
  `<td style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">`,
  `<td class="sched-cell" style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">`
);
html = html.replace(
  `<td style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">`,
  `<td class="sched-cell-right" style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">`
);

// Do it for row 3
html = html.replace(
  `<td style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">`,
  `<td class="sched-cell" style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">`
);
html = html.replace(
  `<td style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">`,
  `<td class="sched-cell" style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">`
);
html = html.replace(
  `<td style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">`,
  `<td class="sched-cell-right" style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">`
);

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Applied comprehensive mobile responsiveness to workshop.html!');
