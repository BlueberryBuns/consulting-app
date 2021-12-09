import React, { useEffect, useRef, useState } from "react";
import initialCameraSetup from "../../media-utils/base-config";
import CameraPlayer from "./CameraPlayer";

const CAMERA_CONFIG = { ...initialCameraSetup };
let isCameraSet = false;
let stream;

const LocalPlayer = (props) => {
  // const videoRef = useRef();

  // useEffect(() => {
  //   const userMedia = async () => {
  //     try {
  //       stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       if (videoRef && videoRef.current && stream !== undefined) {
  //         if (!isCameraSet) {
  //           isCameraSet = true;
  //           videoRef.current.srcObject = stream;
  //           props.videoRef = videoRef;
  //         }
  //       }
  //     }
  //   };
  //   userMedia();
  // }, []);

  const handleCanPlay = () => {
    props.videoRef.current?.play();
  };

  const handleIsStopped = () => {
    return;
  };

  return (
    <CameraPlayer
      videoRef={props.videoRef}
      handleCanPlay={handleCanPlay}
      isMuted={true}
      // size={"300px"}
      style={{}}
      handleIsStopped={handleIsStopped}
    />
  );
};

export default LocalPlayer;
