import React, { useEffect, useRef } from "react";
import initialCameraSetup from "../../media-utils/base-config";
import CameraPlayer from "./CameraPlayer";

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
            props.videoRef.current = videoRef.current;
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
    <CameraPlayer
      client={"Local Camera"}
      handleCanPlay={handleCanPlay}
      isMuted={true}
      videoRef={videoRef}
    />
  );
};

export default LocalPlayer;
