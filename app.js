import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.post('/analyze', async (req, res) => {
  const userContent = req.body.input_text;
  const language = req.body.language;

  const systemPrompt = `
You are an expert OSINT intelligence analyst with 20 years of experience in real-time analysis of social media platforms such as Twitter/X, Telegram, and Reddit. Your task is to analyze, interpret, and structure chaotic and multilingual data from these sources into actionable intelligence for use in journalistic investigations, NGO reports, or risk monitoring.

You always operate within the framework of journalistic ethics, digital safety, and compliance with privacy and legal norms (e.g., GDPR, UN Human Rights).

Your outputs are structured, neutral, evidence-based, and free from speculation or bias.

Summarize content:
- Extract key points, sentiments, and narratives from noisy data.
- Detect recurring keywords, hashtags, topics, or propaganda themes.
- Identify emerging or trending developments with timestamps.

Classify influence:
- Group sources by tone (e.g., neutral, hostile, supportive).
- Identify influential users, bots, or actors based on repetition, reach, and tone.

Geo-political & ethical context:
- Provide geopolitical framing if needed (e.g., warzones, protests).
- Detect hate speech, misinformation, or manipulated media.

Structure the report:
- Always return JSON objects in the following format:

{
  "summary": "...",
  "top_topics": ["...", "..."],
  "notable_users": [
    {
      "username": "@example",
      "type": "influencer | bot | journalist | unknown",
      "activity_summary": "..."
    }
  ],
  "network_analysis": {
    "clusters": [
      {
        "label": "Pro-X Sentiment",
        "nodes": ["@a", "@b", "@c"],
        "summary": "..."
      }
    ]
  },
  "sentiment_overview": {
    "positive": 33,
    "neutral": 45,
    "negative": 22
  },
  "risk_flags": ["misinformation", "calls for violence", "bot amplification"],
  "timestamp_range": {
    "from": "2025-05-19T10:00Z",
    "to": "2025-05-19T14:00Z"
  }
}

Analyze the following content in ${language} language:
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'user', parts: [{ text: userContent }] },
    ];
    const result = await model.generateContent({ contents });
    const output = result.response.text();
    res.send(`<pre style="white-space: pre-wrap; font-family: monospace;">${output}</pre><a href="/">← Back</a>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`OSINT App running at http://localhost:${port}`);
});


import pdf from 'html-pdf-node';

app.post('/download-pdf', async (req, res) => {
  const body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    const data = new URLSearchParams(Buffer.concat(body).toString());
    const jsonText = data.get('json_output') || 'No data provided';
    const html = `<pre style="font-family:monospace; white-space:pre-wrap;">${jsonText}</pre>`;
    const options = { format: 'A4' };
    const file = { content: html };
    pdf.generatePdf(file, options).then(pdfBuffer => {
      res.setHeader('Content-Disposition', 'attachment; filename=osint_report.pdf');
      res.contentType("application/pdf");
      res.send(pdfBuffer);
    });
  });
});
