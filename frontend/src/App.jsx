import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    brandName: "",
    product: "",
    audience: "",
    platform: "Instagram",
    tone: "Professional",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // IMPORTANT: Vercel will inject this automatically
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(`${API_URL}/api/generate`, formData);
      setResult(res.data.data);
    } catch (err) {
      setError("Failed to generate content. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <h1>🚀 AI Social Media Generator</h1>
          <p>Generate product-specific social media content instantly</p>
          <div className="badges">
            <span className="badge">100% FREE</span>
            <span className="badge">AI Powered</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-content">
        <div className="container">
          {/* FORM */}
          <div className="form-section">
            <div className="card">
              <h2>📝 Enter Details</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Brand Name *</label>
                  <input
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product / Service *</label>
                  <input
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Target Audience *</label>
                  <input
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Platform</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                    >
                      <option>Instagram</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                      <option>Facebook</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tone</label>
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Funny</option>
                      <option>Educational</option>
                      <option>Inspirational</option>
                    </select>
                  </div>
                </div>

                <div className="button-group">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "⏳ Generating..." : "✨ Generate"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RESULT */}
          <div className="result-section">
            <div className="card">
              {loading && <p>Generating content…</p>}

              {error && <p>{error}</p>}

              {!loading && !result && (
                <div className="empty-state">
                  <div className="empty-icon">📱</div>
                  <h3>Ready to Generate?</h3>
                  <p>Fill the form and click Generate.</p>
                </div>
              )}

              {result && (
                <div className="result-card">
                  <div className="result-item">
                    <h3>📝 Caption</h3>
                    <div className="caption-box">
                      <p>{result.caption}</p>
                    </div>
                  </div>

                  <div className="result-item">
                    <h3>🏷️ Hashtags</h3>
                    <div className="hashtags">
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="hashtag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="result-item">
                    <h3>📢 CTA</h3>
                    <div className="cta-box">
                      <p>{result.cta}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        Built with ❤️ | Full-Stack AI Project
      </footer>
    </div>
  );
}

export default App;
