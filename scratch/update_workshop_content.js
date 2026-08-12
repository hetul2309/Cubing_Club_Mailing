const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Font link update
const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">`;

if (!html.includes('Plus+Jakarta+Sans')) {
  html = html.replace('<link rel="preconnect"', fontLink + '\n  <link rel="preconnect"');
}

// 2. Heading text style
const oldHeading = `<p style="margin: 0; font-family: 'Outfit', 'Trebuchet MS', 'Segoe UI', Arial, sans-serif; font-size: 28px; font-weight: 800; color: #ffffff;
                letter-spacing: 1.5px; text-transform: uppercase;">🎉 Cubing Club's Workshop</p>`;

const newHeading = `<p style="margin: 0; font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">🎉 Cubing Club's Workshop</p>`;

html = html.replace(/<p style="margin: 0; font-family: 'Outfit'[\s\S]*?🎉 Cubing Club's Workshop<\/p>/g, newHeading);

// 3. Event Details Card Schedule Update
const oldEventDetailsRegex = /<!-- =+ -->\s*<!-- EVENT DETAILS CARD -->[\s\S]*?<!-- =+ -->\s*<!-- HIGHLY HIGHLIGHTED ATTENDANCE NOTE -->[\s\S]*?<\/table>/g;

const newEventDetailsAndAttendance = `<!-- ========================================================= -->
              <!-- EVENT DETAILS & SCHEDULE CARD                              -->
              <!-- ========================================================= -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color: #1a1a2e; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: bold;
                      color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                      📅 Event Details &amp; Schedule
                    </p>
                    <!-- Date row -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
                      <tr>
                        <td style="width: 28px; vertical-align: top; padding-top: 1px;">
                          <span style="font-size: 16px;">📆</span>
                        </td>
                        <td>
                          <span style="font-size: 14px; color: #a0a8c0; font-weight: bold;">Date:&nbsp;</span>
                          <span style="font-size: 15px; color: #ffffff; font-weight: bold;">13th August 2026</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Schedule Breakdown Table -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #252542; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #33335a;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-size: 14px; color: #f4a261; font-weight: bold;">
                                ⏰ 9:00 PM &ndash; 12:00 AM
                              </td>
                              <td style="font-size: 14px; color: #ffffff; font-weight: bold;" align="center">
                                3&times;3 Rubik's Cube
                              </td>
                              <td style="font-size: 13px; color: #a0a8c0; font-weight: bold;" align="right">
                                📍 CEP 110
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #33335a;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-size: 14px; color: #f4a261; font-weight: bold;">
                                ⏰ 9:00 PM &ndash; 10:30 PM
                              </td>
                              <td style="font-size: 14px; color: #ffffff; font-weight: bold;" align="center">
                                2&times;2 Rubik's Cube
                              </td>
                              <td style="font-size: 13px; color: #a0a8c0; font-weight: bold;" align="right">
                                📍 CEP 106
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-size: 14px; color: #f4a261; font-weight: bold;">
                                ⏰ 10:30 PM &ndash; 12:00 AM
                              </td>
                              <td style="font-size: 14px; color: #ffffff; font-weight: bold;" align="center">
                                Pyraminx
                              </td>
                              <td style="font-size: 13px; color: #a0a8c0; font-weight: bold;" align="right">
                                📍 CEP 106
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- ========================================================= -->
              <!-- ATTENDANCE NOTE                                            -->
              <!-- ========================================================= -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color: #fff5f5; border-left: 4px solid #800020; border-radius: 6px; margin-bottom: 26px;">
                <tr>
                  <td style="padding: 14px 18px; font-size: 14px; color: #800020; line-height: 1.6;">
                    <strong>NOTE :</strong> Attendance will be taken for those enrolled in the one-credit course. Please make sure to arrive on time.
                  </td>
                </tr>
              </table>`;

html = html.replace(oldEventDetailsRegex, newEventDetailsAndAttendance);

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('✅ Updated workshop.html header font, schedule table, and attendance box!');
