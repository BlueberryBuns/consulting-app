import React, { useEffect, useRef } from "react";
import { useStore } from "../../stores/custom-store/store";
import initialCameraSetup from "../../media-utils/base-config";
import { mediaMapping } from "../../media-utils/mappings";
import CameraPlayer from "./CameraPlayer";
import { useSelector } from "react-redux";

const CAMERA_CONFIG = { ...initialCameraSetup };
let isCameraSet = false;

const LocalPlayer = (props) => {
  const authState = useSelector((state) => state.account);
  const [globalStore, dispatch] = useStore();
  const videoRef = useRef();

  let location = window.location;
  let webSocketType = "ws://";

  if (location.protocol == "https:") {
    webSocketType = "wss://";
  }
  const serverAddr = "localhost:8000";
  // console.log(serverAddr);
  let wSocketAddr =
    webSocketType +
    serverAddr +
    "/ws/chat/room/123/?token=" +
    authState.accessToken; // + location.pathname;

  // console.log(wSocketAddr);

  const ws = new WebSocket(wSocketAddr);

  ws.onopen = (event) => {
    // Joins or creates room
    console.log("Connection Opened");
    const createdOrJoined = JSON.stringify({
      type: "created.or.joined",
    });
    ws.send(createdOrJoined);
  };

  //1636486277.5522206
  //1636486277554

  ws.onclose = (event) => {
    console.log("Connection closed");
    console.log(event);
  };

  ws.onerror = (event) => {
    console.log("An error occured during processing websocket connection");
    console.log(event);
  };

  ws.onmessage = (event) => {
    //add switch with event handling
    switch (JSON.parse(event.data).type) {
      case "received.sdp":
        // ws.send(
        //   JSON.stringify({
        //     type: "hello",
        //     message: "world",
        //   })
        // );
        break;

      case "hello":
        console.log(event.data);
        break;

      case "bye":
        console.log(event.data);
        break;

      case "created.room":
        console.log(event.data);
        break;

      case "created":
        console.log(event.data);
        break;

      default:
        console.log(event.data);
    }
    // console.log("Message received");
    // console.log(event);
  };

  const assignCamera = () => {
    /**TODO (hulewicz) Add error handling in case of both audio and video
     * being disabled make as output stream empty, black canvas with no
     * sound, eventually ponder over another solution
     *
     * It turned out that solution provided in MDN Web Docs worked better
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/muted
     *
     */
    const getMedias = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
        dispatch(mediaMapping.UPDATE_MEDIASTREAM, stream);
      } catch (err) {
        console.log(err);
      }
    };
    getMedias();
  };

  useEffect(() => {
    assignCamera();
  }, []);

  if (videoRef && videoRef.current && globalStore.mediaStream !== undefined) {
    if (!isCameraSet) {
      isCameraSet = true;
      videoRef.current.srcObject = globalStore.mediaStream;
    }
  } else {
    console.log("Something went wrong with videoref setup");
  }

  const handleCanPlay = () => {
    videoRef.current?.play();
  };

  return (
    <CameraPlayer
      handleCanPlay={handleCanPlay}
      isMuted={true}
      videoRef={videoRef}
    />
  );
};

export default LocalPlayer;
