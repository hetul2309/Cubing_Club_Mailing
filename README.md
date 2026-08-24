# DAU Cubing Club – Email Automation

A lightweight Node.js email automation tool for the DAU Cubing Club that loads HTML email templates, automatically binds inline images, and sends emails through Gmail SMTP using Nodemailer.

---

## 📁 Project Structure

```
Cubing_Club_Mailing/
├── emails/                 <-- Put all your HTML email templates here
│   └── workshop.html       <-- Example: Workshop invitation template
├── images/                 <-- Put all referenced images/logos here
│   ├── 2x2_image_modern.png
│   ├── 3x3_image_modern.png
│   ├── pyra_image_modern.png
│   ├── cubing_club_logo.jpg
│   ├── instagram_logo.png
│   ├── youtube_logo.png
│   └── linkedin_logo.png
├── .env                    <-- Credentials (ignored by Git)
├── .env.example            <-- Example environment variables
├── server.js               <-- Main mailing script
├── package.json
└── README.md
```

> **Note:** The `emails/` folder is dedicated **only** to HTML email files. All image files are stored in the top-level `images/` directory.

---

## 🚀 How to Create and Send a New Email

### 1. Create a new HTML file
Place your new HTML email inside the `emails/` folder (e.g. `emails/competition.html` or `emails/announcement.html`).

### 2. Add images in `images/`
In your HTML file, reference any images like this:
```html
<img src="images/your_image.png" alt="Description" />
```
`server.js` will automatically:
- Detect all `images/...` referenced in your HTML file.
- Convert them to inline CID attachments so they display instantly in Gmail and other email clients without getting blocked.

### 3. Send the Email
- To send the default `workshop.html`:
  ```bash
  npm start
  ```
- To send any specific template (e.g. `competition.html`):
  ```bash
  node server.js competition.html
  ```

---

## ⚙️ Configuration & Credentials

Create a `.env` file in the project root:
```env
EMAIL_USER=yourclubemail@dau.ac.in
EMAIL_PASSWORD=your_16_digit_app_password
```

### How to get a Google App Password:
1. Open your Google Account at [myaccount.google.com](https://myaccount.google.com).
2. Ensure **2-Step Verification** is enabled.
3. Search for **App Passwords** in Security settings.
4. Generate a new App Password (name it "Nodemailer" or "Club Mail").
5. Copy the 16-character password into `.env`.

---

## 👥 Changing Recipients

Open `server.js` and modify the `recipients` array:
```javascript
const recipients = [
  "202511026@dau.ac.in",
  // "batch2026@dau.ac.in",
];
```
