import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

dotenv.config();

const app = express();
const port = process.env.PORT || 7860;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/mnt', express.static('/mnt'));
app.use('/tmp', express.static('/tmp'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/analyze', async (req, res) => {
  const inputText = req.body.input_text;
  const language = req.body.language;

  const systemPrompt = `
You are an expert OSINT analyst with 20 years of experience in real-time analysis of content from platforms such as Twitter/X, Telegram, and Reddit. Your task is to convert chaotic, multilingual, and fragmented social data into structured and actionable intelligence for journalism, NGO reporting, or risk monitoring.
Your outputs must be evidence-based, unbiased, and free from speculation.
Your responsibilities include:
1. Content summarization:
   - Extract key facts, sentiments, and narrative threads.
   - Identify recurring keywords, hashtags, or propaganda themes.
   - Include timestamps for relevant developments.
2. Influence classification:
   - Group actors by tone (e.g., hostile, neutral, supportive).
   - Detect and categorize bots, influencers, journalists, and unknown accounts.
3. Contextualization:
   - Provide geopolitical or situational framing when relevant (e.g., protests, conflicts).
   - Identify hate speech, disinformation, or manipulated content.
4. Format your response as a valid JSON object, using the following schema:
\`\`\`json
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
\`\`\`
Now analyze the following content in the \${language} language:
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: inputText }] }
      ]
    });

    const raw = result.response.text();
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const jsonString = raw.slice(jsonStart, jsonEnd + 1);
    const osintData = JSON.parse(jsonString);

    fs.writeFileSync('/tmp/data.json', JSON.stringify(osintData));

    exec('python3 render_report.py', (error, stdout, stderr) => {
      if (error) {
        console.error('Error generating report:', stderr);
        res.status(500).send('Error rendering the report.');
      } else {
        res.sendFile('/tmp/OSINT_Report.html'); // ✅ absolute path
      }
    });


  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing OSINT report.');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
