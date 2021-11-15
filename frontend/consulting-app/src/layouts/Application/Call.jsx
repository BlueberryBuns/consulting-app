import LocalPlayer from "../../components/CameraPlayer/LocalPlayer";
import RemotePlayer from "../../components/CameraPlayer/RemotePlayer";
import initialCameraSetup from "../../media-utils/base-config";

import { useRef } from "react";
import { useSelector } from "react-redux";
import { useStore } from "../../stores/custom-store/store";

const iceConfiguration = {
  iceServers: [
    {
      urls: "turn:turn.med.blueberrybuns.com:3478",
      username: "test",
      credential: "test123",
    },
  ],
};

const connections = {};
const channels = {};

const CAMERA_CONFIG = { ...initialCameraSetup };
const cameraIsSet = { isReady: false };
let isInitiator = false;
let isChannelReady = false;
let myEmail;

console.log("IS INITIATOR: ", isInitiator);

const CallView = () => {
  const remoteMediaStream = new MediaStream();
  const authState = useSelector((state) => state.account);
  let localStream;
  let remoteStream;
  const localRef = useRef();
  const remoteRef = useRef();

  let location = window.location;
  let webSocketType = "ws://";

  if (location.protocol == "https:") {
    webSocketType = "wss://";
  }

  const serverAddr = "localhost:8000";
  let wSocketAddr =
    webSocketType +
    serverAddr +
    "/ws/chat/room/123/?token=" +
    authState.accessToken; // + location.pathname;

  const ws = new WebSocket(wSocketAddr);

  //https://webrtc.org/getting-started/peer-connections

  ws.onopen = (event) => {
    // Joins or creates room
    console.log("Connection Opened");
    const createdOrJoined = JSON.stringify({
      type: "created.or.joined",
      toGroup: false,
    });
    ws.send(createdOrJoined);
  };

  ws.onclose = (event) => {
    console.log("Connection closed");
    console.log(event);
  };

  ws.onerror = (event) => {
    console.log("An error occured during processing websocket connection");
    console.log(event);
  };

  ws.onmessage = (event) => {
    switch (JSON.parse(event.data).type) {
      case "create":
        myEmail = JSON.parse(event.data).me;
        isInitiator = true;
        break;

      case "join":
        const joinRoom = async () => {
          console.log("1. Joining Channel...");
          // I should have user media got at this point
          try {
            let _ = await waitForSomeTime();
          } catch (error) {
            console.log(error);
          } finally {
            console.log("Continue");
            ws.send(
              JSON.stringify({
                type: "join.announced",
                toGroup: true,
              })
            );
          }
        };
        joinRoom();
        break;

      case "join.announced":
        /*TODO (hulewicz):
         *
         * 1. Calling procedure
         *   a) CreatePeerConnection (with channel)
         *   b) configure data channel
         *   c) attatch handlers
         *
         * 2. Attatch localstream
         * 3. Mark channel as started???
         * 4. Call remote peer
         *   a) Create SDP offer and attatch handlers
         *
         * 5. Send SDP
         *   a) Set local description
         *   b) send offer to peer (via server)
         *
         */
        makeCall(connections, ws, event);
        break;

      case "offer.sdp":
        answerCall(connections, ws, event);
        break;

      case "ice.candidate":
        const acceptCandidate = async () => {
          let data = JSON.parse(event.data);
          const candidate = data.candidate;
          console.log(candidate.candidate);
          // console.log(event.iceCandidate);
          // console.log(event);
          try {
            await connections[data.author].addIceCandidate(
              data.candidate.candidate
            );
          } catch (err) {
            console.log(err);
          }
        };
        acceptCandidate();
        break;

      case "new.ice.candidate":
        console.log("New candidate");
        break;

      case "answer.sdp":
        answerSDP(connections, event);
        break;

      case "bye":
        console.log(event.data);
        break;

      default:
        console.log("Deafult action took place");
        console.log(event.data);
    }
  };

  const waitForSomeTime = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 2000);
    });
  };

  const addPeerConnectionListeners = (peerConnections, webSocket, e) => {
    const data = JSON.parse(e.data);
    console.log("PEER CONNECTION LISTENERS ARE SET");
    peerConnections[data.author].ondatachannel = (event) => {
      console.log("Received new data channel");
    };

    peerConnections[data.author].onicecandidate = (event) => {
      ws.send(
        JSON.stringify({
          toGroup: true,
          type: "ice.candidate",
          candidate: event.candidate,
        })
      );
    };

    peerConnections[data.author].onicegatheringstatechange = (event) => {
      console.log(
        `ICE gathering state changed: ${
          peerConnections[data.author].iceGatheringState
        }`
      );
    };

    peerConnections[data.author].onconnectionstatechange = (event) => {
      console.log(
        `Connection state change: ${
          peerConnections[data.author].connectionState
        }`
      );
    };

    peerConnections[data.author].onsignalingstatechange = (event) => {
      console.log(
        `Signaling state change: ${peerConnections[data.author].signalingState}`
      );
    };

    peerConnections[data.author].oniceconnectionstatechange = (event) => {
      console.log(
        `ICE connection state change: ${
          peerConnections[data.author].iceConnectionState
        }`
      );
    };

    peerConnections[data.author].ontrack = async (event) => {
      console.log("NEW TRACK");
      console.log(event.track);
      remoteMediaStream.addTrack(event.track, remoteMediaStream);
    };
  };

  const answerCall = async (peerConnections, webSocket, e) => {
    const data = JSON.parse(e.data);
    peerConnections[data.author] = new RTCPeerConnection(iceConfiguration);
    localRef.current.srcObject.getTracks().forEach((track) => {
      peerConnections[data.author].addTrack(track, localRef.current.srcObject);
    });
    addPeerConnectionListeners(peerConnections, webSocket, e);
    peerConnections[data.author].setRemoteDescription(
      new RTCSessionDescription(data.offer.offer)
    );
    const answer = await peerConnections[data.author].createAnswer();
    await peerConnections[data.author].setLocalDescription(answer);

    webSocket.send(
      JSON.stringify({
        type: "answer.sdp",
        toGroup: true,
        answer: answer,
      })
    );
  };

  const makeCall = async (peerConnections, webSocket, e) => {
    const data = JSON.parse(e.data);
    peerConnections[data.author] = new RTCPeerConnection(iceConfiguration);
    localRef.current.srcObject.getTracks().forEach((track) => {
      peerConnections[data.author].addTrack(track, localRef.current.srcObject);
    });
    addPeerConnectionListeners(peerConnections, webSocket, e);
    const offer = await peerConnections[data.author].createOffer();
    await peerConnections[data.author].setLocalDescription(offer);
    webSocket.send(
      JSON.stringify({
        type: "offer.sdp",
        toGroup: true,
        offer: offer,
      })
    );
  };

  const answerSDP = async (peerConnections, e) => {
    console.log("New answer SDP");
    const data = JSON.parse(e.data);
    try {
      const remotePeerDescription = new RTCSessionDescription(
        data.answer.answer
      );
      await peerConnections[data.author].setRemoteDescription(
        remotePeerDescription
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <LocalPlayer
        videoRef={localRef}
        stream={localStream}
        cameraSet={cameraIsSet}
      />
      <RemotePlayer videoRef={remoteRef} stream={remoteMediaStream} />
    </>
  );
};

export default CallView;
