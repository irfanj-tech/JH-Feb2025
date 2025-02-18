// YouTubeEmbed.jsx
import React from "react";

const YouTubeEmbed = ({ videoURL }) => {
  // Extract the video ID
  let videoId: string | null = "";
  try {
    const urlParams = new URL(videoURL).searchParams;
    videoId = urlParams.get("v");
  } catch (err) {
    console.error("Invalid YouTube URL:", videoURL);
  }

  if (!videoId) return <p>Invalid video URL provided.</p>;

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <iframe
        title="YouTube Video"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default YouTubeEmbed;
