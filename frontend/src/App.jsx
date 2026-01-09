import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    brandName: "",
    product: "",
    audience: "",
    platform: "Instagram",
    tone: "Professional"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(
        `${API_URL}/api/generate`,
        formData
      );

      const data = res?.data?.data || {};

      setResult({
        caption: data.caption || "Content generated successfully.",
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
        cta: data.cta || "Learn more"
      });

    } catch {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🚀 AI Social Media Generator</h1>
          <p>Create product-specific social media content instantly</p>
          <div className="badges">
            <span className="badge">100% FREE</span>
            <span className="badge">AI Powered</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="form-section">
            <div className="card">
              <h2>📝 Enter Details</h2>

              <form onSubmit={handleSubmit}>
                <input name="brandName" placeholder="Brand" onChange={handleChange} required />
                <input name="product" placeholder="Product" onChange={handleChange} required />
                <input name="audience" placeholder="Audience" onChange={handleChange} required />

                <select name="platform" onChange={handleChange}>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Twitter</option>
                </select>

                <select name="tone" onChange={handleChange}>
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Funny</option>
                  <option>Educational</option>
                  <option>Inspirational</option>
                </select>

                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "⏳ Generating..." : "✨ Generate"}
                </button>
              </form>
            </div>
          </div>

          <div className="result-section">
            <div className="card">
              {loading && <p>Generating…</p>}
              {error && <p>{error}</p>}

              {result && (
                <>
                  <p>{result.caption}</p>
                  <div>
                    {result.hashtags.map((h, i) => (
                      <span key={i}>#{h}</span>
                    ))}
                  </div>
                  <p>{result.cta}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
