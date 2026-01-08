// ============================================
// AI Social Media Generator - FINAL STABLE VERSION
// ============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ============================================
// HOME PAGE (VISIBLE UI FOR INTERVIEWER)
// ============================================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>AI Social Media Generator</title>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #e5e7eb;
      padding: 40px;
    }
    .container {
      max-width: 900px;
      margin: auto;
      background: #020617;
      padding: 30px;
      border-radius: 10px;
    }
    h1 { color: #38bdf8; }
    code {
      background: #111827;
      padding: 4px 6px;
      border-radius: 4px;
      color: #22c55e;
    }
    .box {
      margin-top: 20px;
      padding: 15px;
      background: #020617;
      border-left: 4px solid #38bdf8;
    }
    pre {
      background: #020617;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 AI Social Media Generator</h1>
    <p>
      This is a backend-powered AI application that generates
      <b>product-specific social media captions</b>.
    </p>

    <div class="box">
      <h3>🔗 API Endpoint</h3>
      <p><code>POST /api/generate</code></p>
    </div>

    <div class="box">
      <h3>📦 Sample Request</h3>
<pre><code>{
  "brandName": "NovaReach",
  "product": "AI marketing tool for startups",
  "audience": "startup founders",
  "platform": "Instagram",
  "tone": "Casual"
}</code></pre>
    </div>

    <div class="footer">
      <p>Server is running successfully.</p>
    </div>
  </div>
</body>
</html>
  `);
});

// ============================================
// PRODUCT → PROBLEM MAPPING
// ============================================
function detectProblem(product) {
  const p = product.toLowerCase();

  if (p.includes("marketing") || p.includes("content")) {
    return "creating consistent social media content without wasting time";
  }
  if (p.includes("fitness")) {
    return "staying consistent with workouts";
  }
  if (p.includes("food")) {
    return "deciding what to eat after a long day";
  }
  if (p.includes("expense") || p.includes("finance")) {
    return "tracking expenses without manual effort";
  }
  return "managing daily tasks efficiently";
}

// ============================================
// FALLBACK (SAFE MODE)
// ============================================
function fallbackContent({ brandName, product, audience }) {
  const problem = detectProblem(product);
  return {
    caption: `Many ${audience} struggle with ${problem}. ${brandName} helps by offering ${product} designed for real-world use.`,
    hashtags: ["#Productivity", "#Innovation", "#Startups", "#TechTools"],
    cta: "Learn more"
  };
}

// ============================================
// MAIN API
// ============================================
app.post("/api/generate", async (req, res) => {
  const { brandName, product, audience, platform, tone } = req.body;

  if (!brandName || !product || !audience || !platform || !tone) {
    return res.status(400).json({
      success: false,
      error: "All fields are required"
    });
  }

  try {
    const problem = detectProblem(product);

    const prompt = `
You are a professional social media copywriter.

Product: ${product}
Audience: ${audience}
Brand: ${brandName}
Tone: ${tone}

Problem:
"${problem}"

Generate a social media caption.
Return ONLY valid JSON:
{
  "caption": "",
  "hashtags": [],
  "cta": ""
}
`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 200, temperature: 0.9 }
        })
      }
    );

    const text = await response.text();
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("AI unavailable");

    const aiData = JSON.parse(match[0]);

    return res.json({
      success: true,
      source: "ai",
      data: aiData
    });
  } catch (err) {
    return res.json({
      success: true,
      source: "fallback",
      data: fallbackContent({ brandName, product, audience })
    });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
