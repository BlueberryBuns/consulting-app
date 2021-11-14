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

// const iceConfiguration = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

const connections = {};
const channels = {};

const CAMERA_CONFIG = { ...initialCameraSetup };
let isCameraSet = false;
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
  // console.log(serverAddr);
  let wSocketAddr =
    webSocketType +
    serverAddr +
    "/ws/chat/room/123/?token=" +
    authState.accessToken; // + location.pathname;

  // console.log(wSocketAddr);

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
    //add switch with event handling
    switch (JSON.parse(event.data).type) {
      case "create":
        myEmail = JSON.parse(event.data).me;
        console.log(myEmail);
        console.log("1. Channel created...");
        isInitiator = true;
        break;

      case "join":
        myEmail = JSON.parse(event.data).me;
        console.log(myEmail);
        isChannelReady = true;
        console.log("1. Joining Channel...");
        // I should have user media got at this point

        try {
        } catch (error) {
        } finally {
          ws.send(
            JSON.stringify({
              type: "join.announced",
              toGroup: true,
            })
          );
        }

        break;

      case "join.announced":
        console.log("------------------------------------");
        console.log("Remote user joined channel");
        console.log(JSON.parse(event.data));
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
        const makeCall = async () => {
          const data = JSON.parse(event.data);
          console.log("Creating new peer connection");
          connections[data.author] = new RTCPeerConnection(iceConfiguration);
          console.log(localRef.current.srcObject);
          localRef.current.srcObject.getTracks().forEach((track) => {
            connections[data.author].addTrack(
              track,
              localRef.current.srcObject
            );
          });
          addPeerConnectionListeners(connections[data.author], ws);
          console.log("C?USTOMOWA FUNKCJA !!!!", connections);
          // connections[data.author].onicecandidate = (event) => {
          //   console.log("ICEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
          //   console.log(event);
          // };
          // connections[data.author].onsignalingstatechange = (event) => {
          //   console.log(connections);
          //   console.log(
          //     `SIGNALLING STATE CHANGED TO: ${
          //       connections[data.author].signalingState
          //     }`
          //   );
          // };
          console.log(
            "Creating offer for remote peer\nAnd sets it as local desription???"
          );
          const offer = await connections[data.author].createOffer();
          console.log("creates offer to remote peer's connection");
          await connections[data.author].setLocalDescription(offer);
          console.log("Sets it as a local description");
          console.log(connections);
          console.log("Sending offer to remote peer");
          ws.send(
            JSON.stringify({
              type: "offer.sdp",
              toGroup: true,
              offer: offer,
            })
          );
        };
        console.log("CALL STARTING");
        makeCall();
        console.log("CALL STARTED");
        console.log("------------------------------------");
        break;

      case "offer.sdp":
        console.log("***********************************");
        console.log("Callee");
        const answerCall = async () => {
          const data = JSON.parse(event.data);
          console.log("Creating new peer connection");
          connections[data.author] = new RTCPeerConnection(iceConfiguration);
          addPeerConnectionListeners(connections[data.author], ws);
          try {
            channels[data.author] = connections[data.author].createDataChannel(
              "sendDataChannel",
              { reliable: true }
            );
            console.log("Created DataChannel");
          } catch (err) {
            console.log("Failec to create datachannel");
          }
          console.log("CUSTOMOWA FUNKCJA !!!!", connections);
          // connections[data.author].onicecandidate = (event) => {
          //   console.log("ICEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
          //   console.log(event);
          // };
          // connections[data.author].onsignalingstatechange = (event) => {
          //   console.log(connections);
          //   console.log(
          //     `SIGNALLING STATE CHANGED TO: ${
          //       connections[data.author].signalingState
          //     }`
          //   );
          // };
          console.log("1", connections);
          console.log("accepting offer");
          connections[data.author].setRemoteDescription(
            new RTCSessionDescription(data.offer.offer)
          );
          console.log("creating answer:");
          const answer = await connections[data.author].createAnswer();
          console.log(answer);
          await connections[data.author].setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: "answer.sdp",
              toGroup: true,
              answer: answer,
            })
          );
          console.log("2", connections);
        };
        answerCall();
        console.log("CALL ANSWERED");
        console.log(connections);
        console.log("***********************************");
        break;

      case "ice.candidate":
        const acceptCandidate = async () => {
          const data = JSON.parse(event.data);
          const candidate = data.candidate;
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
        const answerSDP = async () => {
          console.log("received answer from remote peer ");
          const data = JSON.parse(event.data);
          try {
            console.log(data.answer.answer);
            console.log("answer^");
            console.log(
              "Creating and Setting remote peer description basen on answer"
            );
            const remotePeerDescription = new RTCSessionDescription(
              data.answer.answer
            );
            console.log("setting remote description HERE");
            await connections[data.author].setRemoteDescription(
              remotePeerDescription
            );
            console.log("Remote Description is set");
          } catch (err) {
            console.log(err);
          }
        };
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        answerSDP();

        console.log("We should get any ice candidates at this point");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(connections);

        break;

      case "bye":
        console.log(event.data);
        break;

      default:
        console.log("Action took place");
        console.log(event.data);
    }
    // console.log("Message received");
    // console.log(event);
  };

  const addPeerConnectionListeners = (peerConnection, webSocket) => {
    console.log("PEER CONNECTION LISTENERS ARE SET");
    peerConnection.ondatachannel = (event) => {
      console.log("RECEIVED CHANNEEEEEEEEEEEEEEEEELLLLLLLL");
      console.log(JSON.parse(event.data));
    };

    peerConnection.onicecandidate = (event) => {
      // console.log("ICEEEEEEEEEEEEEEEEEEEEEEEEEEEE2");
      // console.log(event.candidate);
      // console.log(typeof event);
      ws.send(
        JSON.stringify({
          toGroup: true,
          type: "ice.candidate",
          // author: myEmail,
          candidate: event.candidate,
        })
      );
    };

    peerConnection.onicegatheringstatechange = (event) => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`
      );
    };

    peerConnection.onconnectionstatechange = (event) => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);
    };

    peerConnection.onsignalingstatechange = (event) => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    };

    peerConnection.oniceconnectionstatechange = (event) => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`
      );
    };

    peerConnection.ontrack = async (event) => {
      console.log("NEW TRACK!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(event.track);
      remoteMediaStream.addTrack(event.track, remoteMediaStream);
    };
  };

  const answerCall = async (peerConnection, webSocket, offer) => {
    // const data = JSON.parse(event.data);
    console.log("Creating new peer connection");
    peerConnection = new RTCPeerConnection(iceConfiguration);
    addPeerConnectionListeners(peerConnection, webSocket);
    console.log("CUSTOMOWA FUNKCJA !!!!", connections);
    console.log("1", connections);
    console.log("accepting offer");
    peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer) //data.offer.offer)
    );
    console.log("creating answer:");
    const answer = await peerConnection.createAnswer();
    console.log(answer);
    await peerConnection.setLocalDescription(answer);

    webSocket.send(
      JSON.stringify({
        type: "answer.sdp",
        toGroup: true,
        answer: answer,
      })
    );
  };

  const makeCall = async (peerConnection, webSocket) => {
    // const data = JSON.parse(event.data);
    console.log("Creating new peer connection");
    peerConnection = new RTCPeerConnection(iceConfiguration);
    addPeerConnectionListeners(peerConnection, webSocket);
    console.log("CUSTOMOWA FUNKCJA !!!!", connections);
    console.log(
      "Creating offer for remote peer\nAnd sets it as local desription???"
    );
    const offer = await peerConnection.createOffer();
    console.log("creates offer to remote peer's connection");
    await peerConnection.setLocalDescription(offer);
    console.log("Sets it as a local description");
    console.log(connections);
    console.log("Sending offer to remote peer");
    webSocket.send(
      JSON.stringify({
        type: "offer.sdp",
        toGroup: true,
        offer: offer,
      })
    );
  };

  return (
    <>
      <LocalPlayer videoRef={localRef} stream={localStream} />
      <RemotePlayer videoRef={remoteRef} stream={remoteMediaStream} />
    </>
  );
};

export default CallView;
