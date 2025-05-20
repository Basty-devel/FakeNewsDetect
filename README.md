# 🛰️ OSINT Analyzer App

A minimal Node.js + Gemini-powered web application to analyze unstructured content from tweets, Reddit threads, Telegram posts, or articles — transforming them into structured OSINT reports.

---

## 🚀 Features
- Paste any social, journalistic, or raw text
- Select content language (EN, DE, FR, etc.)
- AI summarizes, clusters, scores sentiment, and more
- Structured JSON output formatted in-browser
- Export analysis as PDF

---

## 🧾 File Structure

| File            | Description                              |
|-----------------|------------------------------------------|
| `index.html`    | Input form with language dropdown        |
| `app.js`        | Express server & Gemini logic            |
| `json_viewer.js`| Pretty-prints Gemini's JSON response     |
| `package.json`  | Project metadata and dependencies        |

---

## 🌐 How to Deploy on Replit

1. Upload all 4 files to a **new GitHub repo**
2. Go to [https://replit.com/](https://replit.com/)
3. Create new Repl → **Import from GitHub**
4. Add your `GEMINI_API_KEY` via **Secrets**
5. Click Run

---

## 📦 Environment Variables

Create a `.env` file or add to Replit Secrets:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 📄 License
MIT
