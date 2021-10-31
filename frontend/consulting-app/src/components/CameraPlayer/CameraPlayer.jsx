import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";

const CameraPlayer = (props) => {
  return !!props.videoRef ? (
    <video
      playsInline
      ref={props.videoRef}
      onCanPlay={props.handleCanPlay}
      muted={props.isMuted} // @ TODO(hulewicz) potenctially overlooked bug
      autoPlay
      width={"400px"}
    ></video>
  ) : (
    <Box
      sx={{
        width: 300,
        height: 300,
        backgroundColor: "primary.dark",
        "&:hover": {
          backgroundColor: "primary.main",
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    />
  );
};

export default CameraPlayer;
