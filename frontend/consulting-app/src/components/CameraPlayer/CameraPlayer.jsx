import React, { useEffect, useRef } from "react";
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
      // style={{ ...props.style }}
      onEnded={props.handleIsStopped}
    >
      Przeglądarka nie wspiera odtwarzaczy video
    </video>
  );
};

export default CameraPlayer;
