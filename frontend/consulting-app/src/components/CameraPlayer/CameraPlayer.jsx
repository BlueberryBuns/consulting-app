import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import blackscreen from "../../images/blackscreen.jpg";

const CameraPlayer = (props) => {
  return (
    <video
      playsInline
      ref={props.videoRef}
      onCanPlay={props.handleCanPlay}
      muted={props.isMuted}
      autoPlay
      width={props.size}
      poster={blackscreen}
      onEnded={props.handleIsStopped}
    >
      Przeglądarka nie wspiera odtwarzaczy video
    </video>
  );
};

export default CameraPlayer;
