# Cubing Club HTML Email Sender

A simple Node.js script that loads an HTML email template and sends it through the Cubing Club's email account using Nodemailer.

---

## What this project does

This project reads the HTML file at `emails/workshop.html` and sends it as a formatted HTML email through Gmail's SMTP server. No web server or framework is involved — it's just a single script you run when you're ready to send.

---

## Requirements

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- A Gmail or Google Workspace email account for the Cubing Club
- A **Google App Password** (explained below) — this is NOT your regular Gmail password

---

## Installation

Open a terminal in the project folder (`Cubing_Club_Mailing`) and run:

```bash
npm install
```

This installs `nodemailer` and `dotenv` into a `node_modules/` folder.

---

## Environment Setup

Create a file named `.env` in the project root (it may already exist with placeholders):

```
EMAIL_USER=cubingclub@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

- **`EMAIL_USER`** — the Gmail address the email will be sent *from*.
- **`EMAIL_PASSWORD`** — a **Google App Password**, not your normal Gmail password.

### How to get a Google App Password

1. Go to your Google account: [myaccount.google.com](https://myaccount.google.com)
2. Enable **2-Step Verification** if you haven't already (required for App Passwords).
3. Go to **Security → How you sign in to Google → App Passwords**.
4. Create a new App Password (choose "Mail" and your device name).
5. Copy the 16-character password Google gives you and paste it as `EMAIL_PASSWORD` in `.env`.

> ⚠️ Never use your regular Gmail password here. Always use an App Password.
> ⚠️ Never commit `.env` to Git — it is already listed in `.gitignore`.

---

## How to run

Once `.env` is configured and the recipient is set (see below), run:

```bash
npm start
```

You will see either a success message with a Message ID, or a descriptive error message to help you troubleshoot.

---

## How to change the email content

The email content lives entirely in:

```
emails/workshop.html
```

Open that file in any editor, make your changes, and save. You do not need to touch `server.js`.

Look for the comments marked `TODO:` inside `workshop.html` — these tell you which fields (date, time, venue) to update before each send.

---

## How to change recipient(s)

Open `server.js` and edit the `recipients` array (around line 80):

```js
const recipients = [
  "yashvipachani12@gmail.com",
  "202511026@dau.ac.in",
  "premkundadia201@gmail.com",
];
```

You can add as many email addresses to this array as needed. Save the file and run `npm start`.

---

## How to send to multiple recipients

This version sends to a single recipient only. Sending to a bulk list can be added later.

When you are ready to scale:

- Use a proper email service such as [Brevo](https://www.brevo.com/), [Mailgun](https://www.mailgun.com/), or [SendGrid](https://sendgrid.com/) for bulk sending — Gmail has per-day sending limits.
- Respect institutional policies and recipient consent.
- Provide an easy way for recipients to unsubscribe.
- Check your provider's sending limits before blasting a large list.

---

## Troubleshooting

| Problem | Likely cause & fix |
|---|---|
| `Invalid login` or `Username and Password not accepted` | You used your normal Gmail password instead of an App Password. Generate one at [myaccount.google.com](https://myaccount.google.com). |
| `Authentication failed` | 2-Step Verification may not be enabled, or the App Password was typed incorrectly. |
| `EMAIL_USER is not set` | The `.env` file is missing or empty. Copy `.env.example` to `.env` and fill it in. |
| `emails/workshop.html not found` | The HTML file was deleted or moved. Make sure it exists at `emails/workshop.html`. |
| `ECONNREFUSED` or SMTP timeout | Your network may block outgoing SMTP. Try a different network, or check firewall settings. |
| Email lands in spam | This is normal for test sends. Ask recipients to mark it as Not Spam. |
| `Less Secure App Access` message | App Passwords replace this — no need to enable less secure access if you use an App Password. |

---

## Project Structure

```
Cubing_Club_Mailing/
│
├── emails/
│   └── workshop.html    ← Edit this to change the email content
│
├── .env                 ← Your credentials (never commit this)
├── .env.example         ← Safe reference showing required variable names
├── .gitignore
├── package.json
├── server.js            ← Main script — run with: npm start
└── README.md
```
