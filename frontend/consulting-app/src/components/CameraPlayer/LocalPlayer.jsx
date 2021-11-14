import React, { useEffect, useRef } from "react";
import initialCameraSetup from "../../media-utils/base-config";
import CameraPlayer from "./CameraPlayer";

const pc_config = {
  iceServers: [
    {
      url: "turn:turn.med.blueberrybuns.com:3478",
      username: "test",
      passwd: "test123",
    },
  ],
};

const CAMERA_CONFIG = { ...initialCameraSetup };
let isCameraSet = false;
let stream;

const LocalPlayer = (props) => {
  const videoRef = useRef();

  useEffect(() => {
    const userMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
      } catch (error) {
        console.log(error);
      } finally {
        if (videoRef && videoRef.current && stream !== undefined) {
          if (!isCameraSet) {
            isCameraSet = true;
            videoRef.current.srcObject = stream;
          }
        } else {
          console.log("Something went wrong with videoref setup");
        }
      }
    };
    userMedia();
  }, []);

  const handleCanPlay = () => {
    videoRef.current?.play();
  };

  return (
    <>
      <div>camera</div>
      <CameraPlayer
        handleCanPlay={handleCanPlay}
        isMuted={true}
        videoRef={videoRef}
      />
    </>
  );
};

export default LocalPlayer;
