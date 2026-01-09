// ============================================
// AI Social Media Generator – FINAL STABLE BACKEND
// ============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
// PRODUCT → PROBLEM LOGIC
// ============================================
function detectProblem(product) {
  const p = product.toLowerCase();

  if (p.includes("marketing") || p.includes("content")) {
    return "creating consistent content without wasting time";
  }
  if (p.includes("fitness")) {
    return "staying consistent with workouts";
  }
  if (p.includes("food")) {
    return "deciding meals after a long day";
  }
  if (p.includes("finance") || p.includes("expense")) {
    return "tracking money without manual effort";
  }
  if (p.includes("ai")) {
    return "using AI tools without unnecessary complexity";
  }
  return "managing daily tasks efficiently";
}

// ============================================
// TONE-AWARE FALLBACK (NEVER EMPTY)
// ============================================
function fallbackContent({ brandName, product, audience, tone }) {
  const problem = detectProblem(product);

  const toneMap = {
    Professional: {
      caption: `For ${audience}, ${problem} is a real challenge. ${brandName} delivers a ${product} focused on efficiency, clarity, and measurable results.`,
      cta: "Learn more"
    },
    Casual: {
      caption: `${audience} know how frustrating ${problem} can be. ${brandName} keeps ${product} simple and genuinely useful.`,
      cta: "Check it out"
    },
    Funny: {
      caption: `${problem} as a ${audience}? Yeah… not fun 😅  
${brandName} makes ${product} way less painful.`,
      cta: "Tag someone who needs this 😂"
    },
    Educational: {
      caption: `${problem} affects many ${audience}. ${brandName}'s ${product} reduces friction through smarter design and usability.`,
      cta: "Save this for later 📌"
    },
    Inspirational: {
      caption: `${audience} deserve better tools. ${brandName} transforms ${product} into an opportunity to grow with confidence.`,
      cta: "Start your journey"
    }
  };

  const selected = toneMap[tone] || toneMap.Casual;

  return {
    caption: selected.caption,
    hashtags: [
      "#Productivity",
      "#Innovation",
      "#Startups",
      "#TechTools",
      "#Growth"
    ],
    cta: selected.cta
  };
}

// ============================================
// MAIN GENERATE API (GUARANTEED OUTPUT)
// ============================================
app.post("/api/generate", async (req, res) => {
  const { brandName, product, audience, platform, tone } = req.body;

  if (!brandName || !product || !audience || !platform || !tone) {
    return res.status(400).json({
      success: false,
      error: "All fields are required"
    });
  }

  const problem = detectProblem(product);

  const prompt = `
You are a professional social media copywriter.

RULES:
- Caption must be PRODUCT-SPECIFIC
- Caption must clearly match the TONE
- Never return empty fields

Brand: ${brandName}
Product: ${product}
Audience: ${audience}
Tone: ${tone}
Problem: ${problem}

Return ONLY valid JSON:
{
  "caption": "minimum 20 characters",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "string"
}
`;

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
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

    if (
      !aiData.caption ||
      typeof aiData.caption !== "string" ||
      aiData.caption.trim().length < 20
    ) {
      throw new Error("Invalid caption");
    }

    return res.json({
      success: true,
      source: "ai",
      data: {
        caption: aiData.caption,
        hashtags: Array.isArray(aiData.hashtags)
          ? aiData.hashtags
          : ["#AI", "#Productivity"],
        cta: aiData.cta || "Learn more"
      }
    });

  } catch (error) {
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
