import LocalPlayer from "../../components/CameraPlayer/LocalPlayer";
import RemotePlayer from "../../components/CameraPlayer/RemotePlayer";
import initialCameraSetup from "../../media-utils/base-config";

import { useRef } from "react";
import { useSelector } from "react-redux";
import { useStore } from "../../stores/custom-store/store";

const config = {
  iceServers: [
    {
      url: "turn:turn.med.blueberrybuns.com:3478",
      username: "test",
      credential: "test123",
    },
  ],
};

const connections = {};

const CAMERA_CONFIG = { ...initialCameraSetup };
let isCameraSet = false;
let isInitiator = false;
let isChannelReady = false;

console.log("IS INITIATOR: ", isInitiator);

const CallView = () => {
  const authState = useSelector((state) => state.account);
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

  //https://webrtc.org/getting-started/peer-connections
  // const makeCall = async () => {
  //   const peerConnection = new RTCPeerConnection(config);
  //   ws.addEventListener("message", async (event) => {
  //     const e = JSON.parse(event.data);
  //     if (e.answerSDP) {
  //       const remotePeerDescription = new RTCSessionDescription(e.answer);
  //       await peerConnection.setRemoteDescription(remotePeerDescription);
  //       console.log("it wokrs");
  //     }
  //   });

  //   const offer = await peerConnection.createOffer();
  //   await peerConnection.setLocalDescription(offer);
  //   ws.send(
  //     JSON.stringify({
  //       type: "offer.sdp",
  //       toGroup: true,
  //       offer: offer,
  //     })
  //   );
  // };

  // makeCall();

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
      case "created":
        console.log("Channel created");
        isInitiator = true;
        break;

      case "join":
        console.log(event);
        isChannelReady = true;
        console.log("Joining...");
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
        console.log("Joined");
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
          connections[data.author] = new RTCPeerConnection(config);
          const offer = await connections[data.author].createOffer();
          await connections[data.author].setLocalDescription(offer);
          console.log(connections);
          ws.send(
            JSON.stringify({
              type: "offer.sdp",
              toGroup: true,
              offer: offer,
            })
          );
        };
        console.log("CALL STARTED");
        makeCall();

        // console.log("Join announced");
        // console.log(JSON.parse(event.data));
        // ws.send(
        //   JSON.stringify({
        //     type: "offer.sdp",
        //     toGroup: true,
        //     offer: "Offer",
        //   })
        // );

        break;

      case "offer.sdp":
        const answerCall = async () => {
          const data = JSON.parse(event.data);
          console.log(data);
          connections[data.author] = new RTCPeerConnection(config);
          console.log("1", connections);
          connections[data.author].setRemoteDescription(
            new RTCSessionDescription(data.offer.offer)
          );
          const answer = await connections[data.author].createAnswer();
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

        // const data = JSON.parse(event.data);
        // console.log(data);
        // connections[data.author] = new RTCPeerConnection(config);
        // console.log("1", connections);
        // connections[data.author].setRemoteDescription(
        //   new RTCSessionDescription(data.offer.offer)
        // );
        // const answer = await connections[data.author].createAnswer();
        // await connections[data.author].setLocalDescription(answer);

        // console.log("2", connections);

        // const makeCall = async () => {
        //   const data = JSON.parse(event.data);
        //   connections[data.author] = new RTCPeerConnection(config);
        //   const offer = await connections[data.author].createOffer();
        //   await connections[data.author].setLocalDescription(offer);
        //   console.log(connections);
        //   ws.send(
        //     JSON.stringify({
        //       type: "offer.sdp",
        //       toGroup: true,
        //       offer: offer,
        //     })
        //   );
        // };
        answerCall();
        console.log("CALL ANSWERED");
        console.log(connections);
        break;

      // const offer = await peerConnection.createOffer();
      //   await peerConnection.setLocalDescription(offer);
      //   ws.send(
      //     JSON.stringify({
      //       type: "offer.sdp",
      //       toGroup: true,
      //       offer: offer,
      //     })
      //   );
      // };

      case "ice.candidate":
        console.log("Candidate received, sending candidate");
        break;

      case "new.ice.candidate":
        console.log("New candidate");
        break;

      case "answer.sdp":
        const answerSDP = async () => {
          const data = JSON.parse(event.data);
          try {
            console.log(data.answer);
            console.log("answer^");
            const remotePeerDescription = new RTCSessionDescription(
              data.answer.answer
            );
            await connections[data.author].setRemoteDescription(
              remotePeerDescription
            );
          } catch (err) {
            console.log(err);
          }
        };
        answerSDP();
        console.log("ANSWERED SDPPPPPP");
        console.log(connections);
        // console.log("Answer");
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

  return (
    <>
      <LocalPlayer videoRef={videoRef} />
      {/* <RemotePlayer /> */}
    </>
  );
};

export default CallView;
