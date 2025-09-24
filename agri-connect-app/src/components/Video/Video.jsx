import React from 'react';
import { Box, Typography } from "@mui/material";
import "./Video.css";

const YouTubeVideo = () => {
  return (
    <Box className="youtube-video-container">
      <Typography variant="h4" component="h2" className="youtube-video-title">
        Watch Our Latest Video
      </Typography>
      <Box className="youtube-video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/SNKWRB1-5pA?si=2rL8QpxvT1aLWDBm"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="youtube-video-iframe"
        />
      </Box>
    </Box>
  );
};

export default YouTubeVideo;
