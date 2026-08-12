require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Validation – check required config before attempting to send
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

const htmlFilePath = path.join(__dirname, "emails", "workshop.html");

if (!fs.existsSync(htmlFilePath)) {
  console.error("❌ Error: emails/workshop.html not found.");
  console.error("   Make sure the file exists at: " + htmlFilePath);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load HTML template & prepare inline CID attachments using exact 7 files
// ---------------------------------------------------------------------------

let rawHtml = fs.readFileSync(htmlFilePath, "utf-8");

// Map relative image paths in HTML to CIDs for email transport
const emailHtml = rawHtml
  .replace(/src=["']images\/3x3_image_modern\.png["']/g, 'src="cid:3x3_image_modern"')
  .replace(/src=["']images\/2x2_image_modern\.png["']/g, 'src="cid:2x2_image_modern"')
  .replace(/src=["']images\/pyra_image_modern\.png["']/g, 'src="cid:pyra_image_modern"')
  .replace(/src=["']images\/cubing_club_logo\.jpg["']/g, 'src="cid:cubing_club_logo"')
  .replace(/src=["']images\/instagram_logo\.png["']/g, 'src="cid:instagram_logo"')
  .replace(/src=["']images\/youtube_logo\.png["']/g, 'src="cid:youtube_logo"')
  .replace(/src=["']images\/linkedin_logo\.png["']/g, 'src="cid:linkedin_logo"');

const imageAttachments = [
  {
    filename: "3x3_image_modern.png",
    path: path.join(__dirname, "images", "3x3_image_modern.png"),
    cid: "3x3_image_modern",
  },
  {
    filename: "2x2_image_modern.png",
    path: path.join(__dirname, "images", "2x2_image_modern.png"),
    cid: "2x2_image_modern",
  },
  {
    filename: "pyra_image_modern.png",
    path: path.join(__dirname, "images", "pyra_image_modern.png"),
    cid: "pyra_image_modern",
  },
  {
    filename: "cubing_club_logo.jpg",
    path: path.join(__dirname, "images", "cubing_club_logo.jpg"),
    cid: "cubing_club_logo",
  },
  {
    filename: "instagram_logo.png",
    path: path.join(__dirname, "images", "instagram_logo.png"),
    cid: "instagram_logo",
  },
  {
    filename: "youtube_logo.png",
    path: path.join(__dirname, "images", "youtube_logo.png"),
    cid: "youtube_logo",
  },
  {
    filename: "linkedin_logo.png",
    path: path.join(__dirname, "images", "linkedin_logo.png"),
    cid: "linkedin_logo",
  },
];

// ---------------------------------------------------------------------------
// Create the Nodemailer transporter (Gmail SMTP)
// ---------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ---------------------------------------------------------------------------
// Define the email
// ---------------------------------------------------------------------------

// List of recipient email addresses
const recipients = [
  // "yashvipachani12@gmail.com", 
  "202511026@dau.ac.in", //Hetul
  // "202401436@dau.ac.in", //Vatsal
  // "202403062@dau.ac.in", //Yashvi
  // "202301061@dau.ac.in",  //Dhruvil
  // "202301034@dau.ac.in", //Jiya
  // "202501153@dau.ac.in"  //Krishiv
  // "premkundadia201@gmail.com", 
];

const mailOptions = {
  from: `"cubing club" <${process.env.EMAIL_USER}>`,
  to: recipients,
  subject: "🧩 Ready, Set, Twist! - The Cubing Club Workshop",
  html: emailHtml,
  attachments: imageAttachments,
};

// ---------------------------------------------------------------------------
// Send the email
// ---------------------------------------------------------------------------

console.log("📨 Sending email to:", mailOptions.to);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Failed to send email.");
    console.error("   Reason:", error.message);
    console.error("\n   Common fixes:");
    console.error("   • Make sure EMAIL_USER and EMAIL_PASSWORD in .env are correct.");
    console.error("   • Use a Google App Password, NOT your regular Gmail password.");
    console.error("   • Enable 2-Step Verification on your Google account first.");
    console.error("   • Check that Less Secure App Access or App Passwords are configured.");
    return;
  }

  console.log("✅ Email sent successfully!");
  console.log("   Message ID:", info.messageId);
});
