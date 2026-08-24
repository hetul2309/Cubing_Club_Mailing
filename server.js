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
// 2. Select Template (from command argument, .env, or default to workshop.html)
//    Usage:
//      node server.js                  --> sends emails/workshop.html
//      node server.js competition.html  --> sends emails/competition.html
// ---------------------------------------------------------------------------

const templateArg = process.argv[2] || process.env.EMAIL_TEMPLATE || "workshop.html";
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

// Match src="images/..." or src="../images/..."
const imgSrcRegex = /src=["'](?:\.\.\/)?images\/([^"']+)["']/g;
let match;
let emailHtml = rawHtml;

while ((match = imgSrcRegex.exec(rawHtml)) !== null) {
  const imageName = match[1];
  detectedImages.add(imageName);
}

detectedImages.forEach((imageName) => {
  const localImagePath = path.join(imagesDir, imageName);
  if (fs.existsSync(localImagePath)) {
    const cidName = imageName.replace(/[^a-zA-Z0-9_-]/g, "_");
    // Replace all occurrences of this image path with cid:<cidName>
    const replacePattern = new RegExp(`src=["'](?:\\.\\./)?images\\/${imageName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["']`, "g");
    emailHtml = emailHtml.replace(replacePattern, `src="cid:${cidName}"`);

    imageAttachments.push({
      filename: imageName,
      path: localImagePath,
      cid: cidName,
    });
  } else {
    console.warn(`⚠️ Warning: Image referenced in HTML but not found in images/ directory: ${imageName}`);
  }
});

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
  // "yashvipachani12@gmail.com",
  "202511026@dau.ac.in", // Hetul
  // "202401436@dau.ac.in", // Vatsal
  // "202403062@dau.ac.in", // Yashvi
  // "202301061@dau.ac.in", // Dhruvil
  // "202301034@dau.ac.in", // Jiya
  // "202501153@dau.ac.in", // Krishiv
  // "premkundadia201@gmail.com",
];

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
