import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Form state
  const [formData, setFormData] = useState({
    brandName: '',
    product: '',
    audience: '',
    platform: 'Instagram',
    tone: 'Professional'
  });

  // Result state
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState(null);

  // API URL - connects to your backend API
  const API_URL = 'http://localhost:5000';

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);
    setMetadata(null);

    try {
      console.log('📤 Sending request to API...');
      
      // Call YOUR API
      const response = await axios.post(`${API_URL}/api/generate`, formData);
      
      console.log('📥 Received response:', response.data);

      // Set the results
      setResult(response.data.data);
      setMetadata(response.data.metadata);
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.error || 'Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = () => {
    if (!result) return;
    
    const text = `${result.caption}\n\n${result.hashtags.map(t => `#${t}`).join(' ')}\n\n${result.cta}`;
    
    navigator.clipboard.writeText(text)
      .then(() => alert('✅ Copied to clipboard!'))
      .catch(() => alert('❌ Failed to copy'));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      brandName: '',
      product: '',
      audience: '',
      platform: 'Instagram',
      tone: 'Professional'
    });
    setResult(null);
    setError('');
    setMetadata(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🚀 AI Social Media Generator</h1>
          <p>Create engaging social media content in seconds</p>
          <div className="badges">
            <span className="badge">100% FREE</span>
            <span className="badge">Powered by AI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          
          {/* Form Section */}
          <div className="form-section">
            <div className="card">
              <h2>📝 Enter Your Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="brandName">
                    Brand Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g., TechFlow, GreenLeaf, FitLife"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product">
                    Product/Service <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    placeholder="e.g., AI project management tool"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="audience">
                    Target Audience <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    placeholder="e.g., Small business owners, entrepreneurs"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="platform">
                      Platform <span className="required">*</span>
                    </label>
                    <select
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      required
                    >
                      <option value="Instagram">📷 Instagram</option>
                      <option value="LinkedIn">💼 LinkedIn</option>
                      <option value="Twitter">🐦 Twitter</option>
                      <option value="Facebook">👥 Facebook</option>
                      <option value="TikTok">🎵 TikTok</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tone">
                      Tone <span className="required">*</span>
                    </label>
                    <select
                      id="tone"
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      required
                    >
                      <option value="Professional">💼 Professional</option>
                      <option value="Casual">😊 Casual</option>
                      <option value="Funny">😂 Funny</option>
                      <option value="Inspirational">✨ Inspirational</option>
                      <option value="Educational">📚 Educational</option>
                    </select>
                  </div>
                </div>

                <div className="button-group">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>⏳ Generating...</>
                    ) : (
                      <>✨ Generate Post</>
                    )}
                  </button>

                  {result && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      🔄 Reset
                    </button>
                  )}
                </div>
              </form>

              <div className="info-box">
                <p>💡 <strong>Tip:</strong> Be specific about your product and audience for best results!</p>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="result-section">
            <div className="card">
              
              {/* Loading State */}
              {isLoading && (
                <div className="loading">
                  <div className="spinner"></div>
                  <p className="loading-text">🤖 AI is crafting your perfect post...</p>
                  <p className="loading-subtext">
                    First generation may take 20-30 seconds
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="error-message">
                  <h3>❌ Error</h3>
                  <p>{error}</p>
                  <button onClick={() => setError('')} className="btn btn-small">
                    Try Again
                  </button>
                </div>
              )}

              {/* Success State */}
              {result && !isLoading && (
                <div className="result-card">
                  <div className="result-header">
                    <h2>✨ Your Generated Post</h2>
                    {metadata?.note && (
                      <div className="info-note">
                        <p>ℹ️ {metadata.note}</p>
                      </div>
                    )}
                  </div>

                  <div className="result-item">
                    <h3>📝 Caption</h3>
                    <div className="caption-box">
                      <p>{result.caption}</p>
                    </div>
                  </div>

                  <div className="result-item">
                    <h3>🏷️ Hashtags</h3>
                    <div className="hashtags">
                      {result.hashtags.map((tag, index) => (
                        <span key={index} className="hashtag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="result-item">
                    <h3>📢 Call-to-Action</h3>
                    <div className="cta-box">
                      <p>{result.cta}</p>
                    </div>
                  </div>

                  {metadata && (
                    <div className="metadata">
                      <p>🎯 Platform: <strong>{metadata.platform}</strong></p>
                      <p>🎨 Tone: <strong>{metadata.tone}</strong></p>
                      <p>⏰ Generated: {new Date(metadata.generatedAt).toLocaleString()}</p>
                    </div>
                  )}

                  <button onClick={copyToClipboard} className="btn btn-success btn-large">
                    📋 Copy All to Clipboard
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!result && !isLoading && !error && (
                <div className="empty-state">
                  <div className="empty-icon">📱</div>
                  <h3>Ready to Create?</h3>
                  <p>Fill out the form and click "Generate Post" to create amazing social media content!</p>
                  <div className="features">
                    <div className="feature">
                      <span className="feature-icon">⚡</span>
                      <span>Fast Generation</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🎯</span>
                      <span>Targeted Content</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🆓</span>
                      <span>100% Free</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Made with ❤️ | Powered by AI | 100% Free Forever</p>
      </footer>
    </div>
  );
}

export default App;