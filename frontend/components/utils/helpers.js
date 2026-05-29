export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedSecs = String(secs).padStart(2, "0");

  return `${mins}:${paddedSecs}`;
}