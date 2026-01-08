// ============================================
// AI Social Media Generator – FINAL STABLE VERSION
// ============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Safe fetch for Node 18+
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
// PRODUCT → REAL PROBLEM
// ============================================
function detectProductProblem(product) {
  const p = product.toLowerCase();

  if (p.includes("ai") || p.includes("content") || p.includes("marketing")) {
    return "coming up with content ideas consistently without spending hours writing";
  }
  if (p.includes("fitness") || p.includes("workout")) {
    return "starting workouts but losing motivation after a few days";
  }
  if (p.includes("food") || p.includes("delivery")) {
    return "ordering food late because cooking feels exhausting after work";
  }
  if (p.includes("finance") || p.includes("expense")) {
    return "tracking expenses manually and missing important insights";
  }
  if (p.includes("learning") || p.includes("course")) {
    return "trying to learn new skills but struggling to stay consistent";
  }

  return "trying to manage daily tasks more efficiently";
}

// ============================================
// BUILD NARRATIVE
// ============================================
function buildNarratives(problem, audience) {
  return [
    `Many ${audience} struggle with ${problem}.`,
    `${audience} often face ${problem}.`,
    `One common challenge for ${audience} is ${problem}.`
  ];
}

// ============================================
// APPLY TONE (STYLE ONLY)
// ============================================
function applyTone(tone, brandName, product, narrative) {
  switch (tone) {
    case "Funny":
      return `${narrative} 😅 ${brandName} turns ${product} into something that actually helps.`;
    case "Educational":
      return `${narrative} ${brandName} addresses this using ${product} in a structured way.`;
    case "Professional":
      return `${brandName} provides ${product} for teams dealing with this challenge.`;
    case "Inspirational":
      return `${narrative} ${brandName} believes ${product} can help create real progress.`;
    default:
      return `${narrative} ${brandName} uses ${product} to make this part of life simpler.`;
  }
}

// ============================================
// SMART FALLBACK (ANGLE-FIRST)
// ============================================
function generateFallback({ brandName, product, audience, tone }) {
  const problem = detectProductProblem(product);
  const narratives = buildNarratives(problem, audience);
  const narrative =
    narratives[Math.floor(Math.random() * narratives.length)];

  return {
    caption: applyTone(tone, brandName, product, narrative),
    hashtags: [
      "#Productivity",
      "#DigitalTools",
      "#Growth",
      "#Innovation",
      "#Startups"
    ],
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
    const problem = detectProductProblem(product);

    const prompt = `
You are a human social media copywriter.

Product: ${product}
Audience: ${audience}
Brand: ${brandName}
Tone: ${tone}

Core problem:
"${problem}"

Write a social media caption focused on this problem.
Tone should only affect writing style.

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
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: 0.9,
            max_new_tokens: 250,
            return_full_text: false
          }
        })
      }
    );

    const raw = await response.text();
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("Invalid AI response");

    const aiData = JSON.parse(match[0]);

    return res.json({
      success: true,
      source: "ai",
      data: aiData
    });

  } catch (error) {
    const fallback = generateFallback({
      brandName,
      product,
      audience,
      tone
    });

    return res.json({
      success: true,
      source: "fallback",
      data: fallback
    });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
====================================
🚀 AI SOCIAL MEDIA GENERATOR
✅ Server running on port ${PORT}
====================================
`);
});
