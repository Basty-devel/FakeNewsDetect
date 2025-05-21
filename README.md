---
title: FakeDetect
emoji: 🐠
colorFrom: purple
colorTo: red
sdk: docker
pinned: false
license: mit
short_description: A minimal Node.js + Gemini-powered web app to analyze text.
---


# 🕵️ FakeDetect - OSINT Intelligence Analyzer

FakeDetect is a real-time Open Source Intelligence (OSINT) web application that uses Google Gemini AI to analyze and visualize multilingual social media and news content.
https://huggingface.co/spaces/Basti1110/FakeDetect
## ✨ Features

- 🧠 AI-powered content interpretation using Gemini 1.5 Flash
- 📊 Sentiment analysis (positive / neutral / negative breakdown)
- 🌐 Network influence graph for user/entity clustering
- 📌 Structured report output (JSON + HTML)
- 💾 Exportable report as modern dark-mode HTML
- 💬 Multilingual support (EN, DE, ES, FR, RU)

## 🔧 Tech Stack

- **Frontend:** HTML + TailwindCSS
- **Backend:** Node.js (Express) + Python (matplotlib, networkx)
- **AI:** Google Generative AI (Gemini)
- **Deployment:** Hugging Face Spaces (Docker SDK)

## 🚀 Quick Start (Docker)

```bash
git clone https://github.com/Basty-devel/FakeNewsDetect.git
cd FakeNewsDetect
```

# 📦 Environment Variables

Create a `.env` file or add to platform Secrets:

```
GEMINI_API_KEY=your_google_gemini_api_key_here


# Build the container
docker build -t FakeNewsDetect .

# Run the app
docker run -p 7860:7860 FakeNewsDetect
```

Access the app at: [http://localhost:7860](http://localhost:7860)

## 📁 Project Structure

```
├── app.js                  # Node.js backend (Express)
├── render_report.py        # Python rendering (charts + HTML)
├── index.html              # Frontend interface
├── osint_dark_template.html # Dark HTML template for reports
├── requirements.txt        # Python dependencies
├── package.json            # Node dependencies
├── space.yaml              # Hugging Face Space config
├── Dockerfile              # Unified deployment container
└── /tmp                    # Runtime output directory
```

## 🛡 Ethics & Compliance

FakeDetect adheres to:
- 📝 GDPR and digital privacy principles
- 🕊️ Journalistic ethics and OSINT standards
- 🛑 Avoids speculative conclusions, hate speech, or bias

## 🧠 Sample Use Cases

- 🗞 Investigative journalism
- 🛡 NGO threat reporting
- 🧵 Telegram/Reddit sentiment tracking
- 🧾 Misinformation early detection

---

© 2025 FakeDetect by Sebastian Friedrich Nestler. Built with ❤️ for responsible intelligence analysis.



---

## 📄 License
MIT
