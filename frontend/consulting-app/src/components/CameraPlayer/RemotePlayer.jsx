import React, { useEffect, useRef } from "react";
// import { useStore } from "../../custom-store/store";
import { useStore } from "../../stores/custom-store/store";
import initialCameraSetup from "../../media-utils/base-config";
import { mediaMapping } from "../../media-utils/mappings";
import CameraPlayer from "./CameraPlayer";

let isCameraSet = false;

const CAMERA_CONFIG = { ...initialCameraSetup };

const RemotePlayer = (props) => {
  // const [globalStore, dispatch] = useStore();
  const videoRef = useRef();
  //const assignCamera = () => {
  /**TODO (hulewicz) Add error handling in case of both audio and video
   * being disabled make as output stream empty, black canvas with no
   * sound, eventually ponder over another solution
   *
   * It turned out that solution provided in MDN Web Docs worked better
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/muted
   *
   */
  //   const getMedias = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
  //       dispatch(mediaMapping.UPDATE_MEDIASTREAM, stream);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getMedias();
  // };

  // useEffect(() => {
  //   assignCamera();
  // }, []);

  // if (videoRef && videoRef.current) {
  //   //&& globalStore.mediaStream !== undefined) {
  //   if (!isCameraSet) {
  //     console.log("TO SIE WYKONAŁO!!!!!!!!!");
  //     isCameraSet = true;
  //     videoRef.current.srcObject = props.stream; //globalStore.mediaStream;
  //   }
  // } else {
  //   console.log("Something went wrong with videoref setup");
  // }

  const handleCanPlay = () => {
    props.videoRef.current?.play();
  };

  return (
    <CameraPlayer
      handleCanPlay={handleCanPlay}
      isMuted={false}
      videoRef={props.videoRef}
    />
  );
};

export default RemotePlayer;
