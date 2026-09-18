require("dotenv").config();
const { ImapFlow } = require("imapflow");
const MailComposer = require("nodemailer/lib/mail-composer");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1. Validation – check required config
// ---------------------------------------------------------------------------

if (!process.env.EMAIL_USER) {
  console.error("❌ Error: EMAIL_USER is not set in .env.");
  process.exit(1);
}

if (!process.env.EMAIL_PASSWORD) {
  console.error("❌ Error: EMAIL_PASSWORD is not set in .env.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Select Template
// ---------------------------------------------------------------------------

const templateArg = process.argv[2] || process.env.EMAIL_TEMPLATE || "intra_da_results.html";
const templateFilename = templateArg.endsWith(".html") ? templateArg : `${templateArg}.html`;
const htmlFilePath = path.join(__dirname, "emails", templateFilename);

if (!fs.existsSync(htmlFilePath)) {
  console.error(`❌ Error: Template file not found at: ${htmlFilePath}`);
  process.exit(1);
}

let rawHtml = fs.readFileSync(htmlFilePath, "utf-8");

// Extract title from HTML if no subject is specified
const titleMatch = rawHtml.match(/<title>([^<]+)<\/title>/i);
const defaultSubject = titleMatch ? titleMatch[1].trim() : "The Cubing Club – DAU";
const emailSubject = process.env.EMAIL_SUBJECT || defaultSubject;

// ---------------------------------------------------------------------------
// 3. Dynamic Inline Image Detection & CID Attachment Resolver
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

// ---------------------------------------------------------------------------
// 4. Recipients & Mail Options
// ---------------------------------------------------------------------------

const recipients = [
  // "hetulkadiya@gmail.com",
  // "yashvipachani12@gmail.com",
  "202511026@dau.acin", // Hetul
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
// 5. Build MIME Message and Save to Gmail Drafts via IMAP
// ---------------------------------------------------------------------------

async function saveAsDraft() {
  console.log("--------------------------------------------------");
  console.log(`📄 Template:       emails/${templateFilename}`);
  console.log(`📌 Subject:        ${mailOptions.subject}`);
  console.log(`🖼️  Inline images:  ${imageAttachments.length} attached`);
  console.log(`📨 To:             ${Array.isArray(mailOptions.to) ? mailOptions.to.join(", ") : mailOptions.to}`);
  console.log("--------------------------------------------------");
  console.log("⏳ Composing email and connecting to Gmail IMAP...");

  const composer = new MailComposer(mailOptions);
  const messageBuffer = await composer.compile().build();

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: false,
  });

  try {
    await client.connect();

    // Find the Drafts folder (specialUse: '\Drafts' or fallback '[Gmail]/Drafts')
    let draftsPath = "[Gmail]/Drafts";
    const mailboxes = await client.list();
    const draftBox = mailboxes.find((box) => box.specialUse === "\\Drafts");
    if (draftBox) {
      draftsPath = draftBox.path;
    }

    console.log(`📁 Saving draft to: "${draftsPath}"...`);
    await client.append(draftsPath, messageBuffer, ["\\Draft", "\\Seen"]);

    console.log("✅ Successfully saved as a Draft in your Gmail!");
    console.log("   Open Gmail -> Drafts folder to preview, edit, or test-send.");
  } catch (err) {
    console.error("❌ Failed to save draft via IMAP.");
    console.error("   Reason:", err.message);
    console.error("\n   Common fixes:");
    console.error("   • Make sure IMAP is enabled in Gmail Settings > Forwarding and POP/IMAP.");
    console.error("   • Make sure EMAIL_USER and EMAIL_PASSWORD (App Password) in .env are correct.");
  } finally {
    await client.logout();
  }
}

saveAsDraft();
