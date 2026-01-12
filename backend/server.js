// ============================================
// AI Social Media Generator – FINAL PRODUCTION BACKEND
// ============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Dynamic import for node-fetch (Node 18+ safe)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ============================================
// HEALTH CHECK
// ============================================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "🚀 AI Social Media Generator running"
  });
});

// ============================================
// FALLBACK (NEVER FAILS, NEVER GENERIC)
// ============================================
function fallbackContent({ brandName, product, audience, tone }) {
  const toneMap = {
    Professional: `For ${audience}, ${product} should be reliable and efficient. ${brandName} focuses on delivering real value without unnecessary complexity.`,
    Casual: `${audience} know how annoying ${product} problems can be. ${brandName} keeps things simple and actually useful.`,
    Funny: `${product} problems again? 😅 ${brandName} makes life easier for ${audience}.`,
    Educational: `${product} plays a key role for ${audience}. ${brandName} simplifies the experience through thoughtful design.`,
    Inspirational: `${audience} deserve better experiences. ${brandName} turns ${product} into something empowering.`
  };

  return {
    caption: toneMap[tone] || toneMap.Casual,
    hashtags: ["#Innovation", "#Productivity", "#Growth"],
    cta: "Learn more"
  };
}

// ============================================
// STEP 1: AI PRODUCT UNDERSTANDING (GENERIC)
// ============================================
async function analyzeProductContext({ brandName, product, audience }) {
  const analysisPrompt = `
You are a product strategist.

Analyze the product below and extract intent.

Brand: ${brandName}
Product: ${product}
Audience: ${audience}

Return ONLY valid JSON:
{
  "category": "type of product or service",
  "problem": "main user pain point",
  "benefit": "main value delivered",
  "emotion": "emotion user should feel"
}
`;

  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: analysisPrompt,
        parameters: { max_new_tokens: 180, temperature: 0.3 }
      })
    }
  );

  const raw = await response.text();
  const match = raw.match(/\{[\s\S]*\}/);

  if (!match) throw new Error("Analysis failed");

  return JSON.parse(match[0]);
}

// ============================================
// MAIN GENERATE API (ROBUST & GENERIC)
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
    // STEP 1: Understand product context
    const context = await analyzeProductContext({
      brandName,
      product,
      audience
    });

    // STEP 2: Generate content using understanding
    const generationPrompt = `
You are a senior social media copywriter.

Context:
Product Category: ${context.category}
User Problem: ${context.problem}
Primary Benefit: ${context.benefit}
Emotional Angle: ${context.emotion}

Brand: ${brandName}
Audience: ${audience}
Platform: ${platform}
Tone: ${tone}

Rules:
- Be realistic and specific
- Avoid generic marketing lines
- 2–3 natural sentences
- No exaggeration

Return ONLY valid JSON:
{
  "caption": "string",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "string"
}
`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: generationPrompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.9,
            repetition_penalty: 1.2
          }
        })
      }
    );

    const raw = await response.text();
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("Invalid AI output");

    const aiData = JSON.parse(match[0]);

    if (!aiData.caption || aiData.caption.trim().length < 15) {
      throw new Error("Weak caption");
    }

    return res.json({
      success: true,
      source: "ai",
      data: {
        caption: aiData.caption,
        hashtags: Array.isArray(aiData.hashtags)
          ? aiData.hashtags
          : ["#Innovation", "#Growth"],
        cta: aiData.cta || "Learn more"
      }
    });

  } catch (err) {
    // SAFE FALLBACK (never breaks UI)
    return res.json({
      success: true,
      source: "fallback",
      data: fallbackContent({ brandName, product, audience, tone })
    });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
