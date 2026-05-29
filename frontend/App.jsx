import Sidebar from "./components/Sidebar";
import VideoCard from "./components/VideoCard";
import "./styles.css";

const videoData = [
  {
    id: 1,
    title: "AI Video Generator Demo",
    duration: 152,
    thumbnailUrl: "https://via.placeholder.com/440x240",
  },
  {
    id: 2,
    title: "Create Videos from Text Prompts",
    duration: 215,
    thumbnailUrl: "https://via.placeholder.com/440x240",
  },
  {
    id: 3,
    title: "Export & Share Your Clips",
    duration: 98,
    thumbnailUrl: "https://via.placeholder.com/440x240",
  },
];

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="content-area">
        <header className="page-header">
          <div>
            <p className="eyebrow">AI Video Generator</p>
            <h1>Create short videos with smart automation</h1>
          </div>
        </header>

        <section className="video-grid">
          {videoData.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
