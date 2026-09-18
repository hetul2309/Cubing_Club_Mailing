require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1. Validation – check required config
// ---------------------------------------------------------------------------

if (!process.env.EMAIL_USER) {
  console.error("❌ Error: EMAIL_USER is not set.");
  console.error("   Open the .env file and add your Gmail address.");
  process.exit(1);
}

if (!process.env.EMAIL_PASSWORD) {
  console.error("❌ Error: EMAIL_PASSWORD is not set.");
  console.error("   Open the .env file and add your Google App Password.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Select Template (from command argument, .env, or default to intra_da_results.html)
//    Usage:
//      node server.js                      --> sends emails/intra_da_results.html
//      node server.js intra_da.html        --> sends emails/intra_da.html
// ---------------------------------------------------------------------------

const templateArg = process.argv[2] || process.env.EMAIL_TEMPLATE || "intra_da_results.html";
const templateFilename = templateArg.endsWith(".html") ? templateArg : `${templateArg}.html`;
const htmlFilePath = path.join(__dirname, "emails", templateFilename);

if (!fs.existsSync(htmlFilePath)) {
  console.error(`❌ Error: Template file not found at: ${htmlFilePath}`);
  console.error("   Available templates in emails/ folder:");
  const available = fs.readdirSync(path.join(__dirname, "emails")).filter((f) => f.endsWith(".html"));
  available.forEach((f) => console.log(`   - ${f}`));
  process.exit(1);
}

let rawHtml = fs.readFileSync(htmlFilePath, "utf-8");

// Extract title from HTML if no subject is specified in .env
const titleMatch = rawHtml.match(/<title>([^<]+)<\/title>/i);
const defaultSubject = titleMatch ? titleMatch[1].trim() : "The Cubing Club – DAU";
const emailSubject = process.env.EMAIL_SUBJECT || defaultSubject;

// ---------------------------------------------------------------------------
// 3. Dynamic Inline Image Detection & CID Attachment Resolver
//    Automatically scans HTML for any `images/<filename>` references,
//    replaces them with `cid:<cid>`, and attaches them from the `images/` folder.
// ---------------------------------------------------------------------------

const imagesDir = path.join(__dirname, "images");
const imageAttachments = [];
const detectedImages = new Set();

const imgRefRegex = /(?:src=["']|background=["']|url\(["']?|<v:fill[^>]+src=["'])(?:\.\.\/)?images\/([^"'\)\s>]+)/g;
let match;
let emailHtml = rawHtml;

while ((match = imgRefRegex.exec(rawHtml)) !== null) {
  const imageName = match[1].replace(/["'\)]/g, "");
  detectedImages.add(imageName);
}

detectedImages.forEach((imageName) => {
  const localImagePath = path.join(imagesDir, imageName);
  if (fs.existsSync(localImagePath)) {
    const cidName = imageName.replace(/[^a-zA-Z0-9_-]/g, "_");
    // Replace all occurrences of this image path with cid:<cidName>
    const replacePattern = new RegExp(`(?:\\.\\./)?images\\/${imageName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`, "g");
    emailHtml = emailHtml.replace(replacePattern, `cid:${cidName}`);

    imageAttachments.push({
      filename: imageName,
      path: localImagePath,
      cid: cidName,
    });
  } else {
    console.warn(`⚠️ Warning: Image referenced in HTML but not found in images/ directory: ${imageName}`);
  }
});

// Append an invisible unique token to prevent email clients (like Gmail) from folding repeated sections or threads
const uniqueToken = `<div style="display:none !important;font-size:1px;color:#f0f2f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">&#847;&zwnj;&nbsp;[${Date.now()}]</div>`;
if (emailHtml.includes("</body>")) {
  emailHtml = emailHtml.replace("</body>", `${uniqueToken}</body>`);
} else {
  emailHtml += uniqueToken;
}

// ---------------------------------------------------------------------------
// 4. Create Nodemailer transporter (Gmail SMTP)
// ---------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ---------------------------------------------------------------------------
// 5. Define Recipients & Mail Options
// ---------------------------------------------------------------------------

const recipients = [
  "hetulkadiya@gmail.com",
  // "yashvipachani12@gmail.com",
  //"202511026@dau.ac.in", // Hetul
  // "202401436@dau.ac.in", // Vatsal
  // "202403062@dau.ac.in", // Yashvi
  // "202501153@dau.ac.in", // Krishiv
  // "premkundadia201@gmail.com",
];

// const recipients = [
//   "phd2016@dau.ac.in",
//   "phd2017@dau.ac.in",
//   "phd2018@dau.ac.in",
//   "phd2019@dau.ac.in",
//   "phd2020@dau.ac.in",
//   "phd2021@dau.ac.in",
//   "phd2022@dau.ac.in",
//   "phd2023@dau.ac.in",
//   "phd2024@dau.ac.in",
//   "phd2025@dau.ac.in",
//   "phd@dau.ac.in",
//   "phd2026@dau.ac.in",

//   "btechict2023@dau.ac.in",
//   "btechcs2023@dau.ac.in",
//   "btechmnc2023@dau.ac.in",
//   "btechevd2023@dau.ac.in",

//   "btechict2024@dau.ac.in",
//   "btechcs2024@dau.ac.in",
//   "btechmnc2024@dau.ac.in",
//   "btechevd2024@daiict.ac.in",

//   "mtech2024@dau.ac.in",
//   "mdes2024@dau.ac.in",
//   "mscds2024@dau.ac.in",
//   "mscit2024@dau.ac.in",
//   "mscaa2024@dau.ac.in",

//   "btechict2025@dau.ac.in",
//   "btechcs2025@dau.ac.in",
//   "btechmnc2025@dau.ac.in",
//   "btechevd2025@dau.ac.in",
//   "mdesiuxd2025@dau.ac.in",
//   "mscaa2025@dau.ac.in",
//   "mdes2025@dau.ac.in",
//   "mtech2025@dau.ac.in",
//   "mscit2025@dau.ac.in",
//   "mscds2025@dau.ac.in",

//   "btechcsai2026@dau.ac.in",
//   "btecheceai2026@dau.ac.in",
//   "btechict2026@dau.ac.in",
//   "btechevd2026@dau.ac.in",
//   "btechmnc2026@dau.ac.in",
//   "btechcs2026@dau.ac.in",
//   "bsmsit2026@dau.ac.in",
//   "bsmsdsai2026@dau.ac.in",
//   "mtech2026@dau.ac.in",
//   "mscds2026@dau.ac.in",
//   "mscit2026@dau.ac.in",
//   "mscaa2026@dau.ac.in",
//   "mdesiuxd2026@dau.ac.in",
// ];



const mailOptions = {
  from: `"cubing club" <${process.env.EMAIL_USER}>`,
  to: recipients,
  subject: emailSubject,
  html: emailHtml,
  attachments: imageAttachments,
};

// ---------------------------------------------------------------------------
// 6. Send the Email
// ---------------------------------------------------------------------------

console.log("--------------------------------------------------");
console.log(`📄 Using template: emails/${templateFilename}`);
console.log(`📌 Subject:        ${mailOptions.subject}`);
console.log(`🖼️  Inline images:  ${imageAttachments.length} attached (${imageAttachments.map((a) => a.filename).join(", ") || "none"})`);
console.log(`📨 Sending to:     ${Array.isArray(mailOptions.to) ? mailOptions.to.join(", ") : mailOptions.to}`);
console.log("--------------------------------------------------");

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Failed to send email.");
    console.error("   Reason:", error.message);
    console.error("\n   Common fixes:");
    console.error("   • Make sure EMAIL_USER and EMAIL_PASSWORD in .env are correct.");
    console.error("   • Use a Google App Password, NOT your regular Gmail password.");
    console.error("   • Enable 2-Step Verification on your Google account first.");
    return;
  }

  console.log("✅ Email sent successfully!");
  console.log("   Message ID:", info.messageId);
});
