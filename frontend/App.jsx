import Sidebar from "./components/Sidebar";
import VideoCard from "./components/VideoCard";
import "./styles.css";

const videoData = [
  {
    id: 1,
    title: "AI Video Generator Demo",
    duration: 152,
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Create Videos from Text Prompts",
    duration: 215,
    thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Export & Share Your Clips",
    duration: 98,
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
];

const features = [
  {
    id: 1,
    title: "AI Script to Storyboard",
    description: "Turn text prompts into structured scenes, narration, and visuals automatically.",
  },
  {
    id: 2,
    title: "One-click Voice Synthesis",
    description: "Generate natural-sounding narrations and aligned subtitles for every video.",
  },
  {
    id: 3,
    title: "Publish Anywhere",
    description: "Export optimized videos for social, training, or marketing with one click.",
  },
];

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="content-area">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">AI Video Generator</span>
            <h1>Build stunning short videos from text, images, and voice.</h1>
            <p className="hero-description">
              Create publish-ready clips faster with intelligent script generation,
              auto-created visuals, narration, subtitles, and export tooling.
            </p>
            <div className="hero-actions">
              <button className="button-primary">Start a new project</button>
              <button className="button-secondary">View demo</button>
            </div>
          </div>

          <aside className="hero-preview">
            <div className="preview-card">
              <p className="preview-label">Latest Render</p>
              <h2>Marketing Spotlight</h2>
              <p className="preview-copy">AI-generated social video ready to download and share.</p>
              <div className="preview-stats">
                <span>2 min</span>
                <span>3 scenes</span>
                <span>auto subtitles</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="feature-grid">
          {features.map((feature) => (
            <article key={feature.id} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="video-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent videos</p>
              <h2>Fast previews for every workflow</h2>
            </div>
          </div>

          <div className="video-grid">
            {videoData.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
