const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'emails', 'workshop.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Update header font to Plus Jakarta Sans
html = html.replace("font-family: 'Outfit', 'Trebuchet MS'", "font-family: 'Plus Jakarta Sans', 'Trebuchet MS'");

// Find start of Event Details and end of Attendance section
const startMarker = '<!-- ========================================================= -->\n              <!-- EVENT DETAILS CARD';
const endMarker = '<!-- Beginner-friendly message -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `<!-- ========================================================= -->
              <!-- EVENT DETAILS & SCHEDULE CARD                              -->
              <!-- ========================================================= -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color: #1a1a2e; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 16px 0; font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: bold;
                      color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                      📅 Event Details &amp; Schedule
                    </p>
                    <!-- Date row -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
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
                      style="background-color: #252542; border-radius: 10px; overflow: hidden;">
                      <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #33335a;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">
                                ⏰ 9:00 PM &ndash; 12:00 AM
                              </td>
                              <td style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">
                                3&times;3 Rubik's Cube
                              </td>
                              <td style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">
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
                              <td style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">
                                ⏰ 9:00 PM &ndash; 10:30 PM
                              </td>
                              <td style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">
                                2&times;2 Rubik's Cube
                              </td>
                              <td style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">
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
                              <td style="font-size: 14px; color: #f4a261; font-weight: bold; width: 45%;">
                                ⏰ 10:30 PM &ndash; 12:00 AM
                              </td>
                              <td style="font-size: 14px; color: #ffffff; font-weight: bold; text-align: center;">
                                Pyraminx
                              </td>
                              <td style="font-size: 13px; color: #a0a8c0; font-weight: bold; text-align: right; width: 25%;">
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
              </table>\n\n              `;

  html = html.substring(0, startIndex) + replacement + html.substring(endIndex);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('✅ Replaced Event Details and Attendance section successfully!');
} else {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
}
