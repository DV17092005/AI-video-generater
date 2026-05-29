import { formatTime } from "./utils/helpers";

function VideoCard({ title, duration, thumbnailUrl }) {
  return (
    <article className="video-card">
      <img src={thumbnailUrl} alt={title} />
      <div>
        <h2>{title}</h2>
        <div className="video-card-footer">
          <span className="duration-pill">{formatTime(duration)}</span>
          <button className="button-primary" type="button">
            Watch
          </button>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;