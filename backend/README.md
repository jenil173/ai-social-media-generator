# AI Social Media Generator API

A free, open-source API for generating social media content using AI.

## Features
- ✅ 100% FREE
- ✅ No API key required
- ✅ Multiple platforms supported
- ✅ AI-powered content generation

## Endpoints

### GET /
Health check endpoint

### POST /api/generate
Generate social media content

**Request Body:**
```json
{
  "brandName": "TechFlow",
  "product": "AI project management tool",
  "audience": "Small business owners",
  "platform": "Instagram",
  "tone": "Professional"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "caption": "Your generated caption here...",
    "hashtags": ["tech", "business", "innovation"],
    "cta": "Your call to action here..."
  }
}
```

## Installation
```bash
npm install
npm start
```

## Usage
```javascript
const response = await fetch('http://localhost:5000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brandName: 'MyBrand',
    product: 'My Product',
    audience: 'My Audience',
    platform: 'Instagram',
    tone: 'Professional'
  })
});

const data = await response.json();
console.log(data);
```

## License
MIT