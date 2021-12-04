import LocalPlayer from "../../components/CameraPlayer/LocalPlayer";
import RemotePlayer from "../../components/CameraPlayer/RemotePlayer";

import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useStore } from "../../stores/custom-store/store";
import initialCameraSetup from "../../media-utils/base-config";

import CameraPlayer from "../../components/CameraPlayer/CameraPlayer";
import { Button, Card, Grid, Paper } from "@mui/material";
import authAxios from "../../Auth/auth-axios";

const CAMERA_CONFIG = { ...initialCameraSetup };

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
let isCameraSet = false;
let isInitiator = false;

console.log("IS INITIATOR: ", isInitiator);

const CallView = () => {
  let remoteMediaStream = new MediaStream();
  const authState = useSelector((state) => state.account);

  let stream;

  const videoRef = useRef();
  const remoteRef = useRef();
  console.log(videoRef);
  console.log(remoteRef);

  useEffect(() => {
    const getMedia = async () => {
      try {
        console.log(navigator);
        stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
        console.log(videoRef);
        console.log(stream);
      } catch (error) {
        console.log(error);
      } finally {
        if (videoRef) {
          videoRef.current.srcObject = stream;
          isCameraSet = true;
          console.log(videoRef);
        }
      }
    };
    getMedia();
  }, []);

  let webSocketScheme = window.location.protocol === "https:" ? "wss:" : "ws:";
  let url = `${webSocketScheme}//${window.location.host}`;
  console.log(url);

  let wSocketAddr = `${url}/ws/chat/room/123/?token=${authState.accessToken}`;
  const ws = new WebSocket(wSocketAddr);
  console.log(wSocketAddr);
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
        console.log("1. CREATED THE ROOM");
        isInitiator = true;
        const foo = async () => {
          try {
            if (videoRef && videoRef.current) {
              console.log(videoRef, "INSIDE");
            }
            console.log(videoRef, "outside");
          } catch (err) {
          } finally {
          }
        };
        foo();
        break;

      case "join":
        const joinRoom = async () => {
          console.log("1. JOINING CHANNEL");
          // I should have user media got at this point
          try {
            const localStream = await navigator.mediaDevices.getUserMedia(
              CAMERA_CONFIG
            );
            console.log(localStream);
            console.log("got new Localstream");
            if (videoRef && videoRef.current) {
              videoRef.current.srcObject = localStream;
            }
          } catch (error) {
            console.log(error);
          } finally {
            console.log("2. SENDING ANNOUNCEMENT");
            ws.send(
              JSON.stringify({
                type: "join.announced",
                toGroup: true,
              })
            );
          }
        };
        joinRoom();
        console.log("sending join message");
        break;

      case "join.announced":
        console.log("2. RECEIVED JOIN ANNOUNCEMENT, STARTING CALL");
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
        console.log("3. RECEIVED CALL, ANSWERING, GOT SDP OFFER");
        answerCall(connections, ws, event);
        break;

      case "ice.candidate":
        console.log("RECEIVED ICE CANDIDATE");
        const acceptCandidate = async () => {
          let data = JSON.parse(event.data);
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
        console.log("4. ANSWERING SDP CONNECTIONS");
        answerSDP(connections, event);
        break;

      case "bye":
        disconnectUser(connections, event);
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

  const disconnectUser = (peerConnections, e) => {
    const data = JSON.parse(e.data);
    const disconnectedUser = data.data["disconnected_user"].email;
    // delete peerConnections[disconnectedUser];
    console.log("current ref:", remoteRef.current);
    remoteMediaStream.getTracks().forEach((track) => {
      remoteMediaStream.removeTrack(track);
      console.log("removed track", track);
    });
  };

  const addPeerConnectionListeners = (peerConnections, webSocket, e) => {
    const data = JSON.parse(e.data);
    console.log("PEER CONNECTION LISTENERS ARE SET");
    peerConnections[data.author].ondatachannel = (event) => {
      console.log("Received new data channel");
    };

    peerConnections[data.author].onicecandidate = (event) => {
      try {
        ws.send(
          JSON.stringify({
            toGroup: true,
            type: "ice.candidate",
            candidate: event.candidate,
          })
        );
      } catch (err) {}
    };

    peerConnections[data.author].onicegatheringstatechange = (event) => {
      try {
        console.log(
          `ICE gathering state changed: ${
            peerConnections[data.author].iceGatheringState
          }`
        );
      } catch (err) {}
    };

    peerConnections[data.author].onconnectionstatechange = (event) => {
      try {
        console.log(
          `Connection state change: ${
            peerConnections[data.author].connectionState
          }`
        );
        if (peerConnections[data.author].connectionState === "connected") {
          console.log("before removal");
          console.log(remoteMediaStream.getTracks());
        }
      } catch (err) {}
    };

    peerConnections[data.author].onsignalingstatechange = (event) => {
      try {
        console.log(
          `Signaling state change: ${
            peerConnections[data.author].signalingState
          }`
        );
      } catch (err) {}
    };

    peerConnections[data.author].oniceconnectionstatechange = (event) => {
      try {
        console.log(
          `ICE connection state change: ${
            peerConnections[data.author].iceConnectionState
          }`
        );
        if (
          peerConnections[data.author].iceConnectionState === "disconnected"
        ) {
          remoteMediaStream.getTracks().forEach((track) => {
            remoteMediaStream.removeTrack(track);
            console.log("removed track", track);
          });
          console.log("after removal");
          console.log(remoteMediaStream.getTracks());
          delete peerConnections[data.author];
        }
      } catch (err) {}
    };

    peerConnections[data.author].ontrack = async (event) => {
      try {
        console.log("NEW TRACK");
        console.log(event.track);
        remoteMediaStream.addTrack(event.track, remoteMediaStream);
        console.log("MEDIASTREAM AFTER ADDING ALL TRACKS", remoteMediaStream);
        remoteRef.current.srcObject = remoteMediaStream;
      } catch (err) {}
    };
  };

  const answerCall = async (peerConnections, webSocket, e) => {
    const data = JSON.parse(e.data);
    peerConnections[data.author] = new RTCPeerConnection(iceConfiguration);
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => {
        peerConnections[data.author].addTrack(
          track,
          videoRef.current.srcObject
        );
      });
    }
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
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => {
        peerConnections[data.author].addTrack(
          track,
          videoRef.current.srcObject
        );
      });
    } else {
      console.log("No nie wykonałop się");
    }
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
      console.error(err);
    }
  };

  return (
    <>
      <main>
        <Grid container spacing={2}>
          <Grid py={1} item xs={6} md={8} m={4} p={4}>
            <RemotePlayer videoRef={remoteRef} />
          </Grid>
          <Grid>
            <Grid py={1} item xs={6} md={4}>
              <LocalPlayer videoRef={videoRef} />
            </Grid>
            <Grid py={1} item xs={6} md={4}>
              <LocalPlayer videoRef={videoRef} />
            </Grid>
          </Grid>
        </Grid>
        <Button
          onClick={async () => {
            try {
              const res = await authAxios.get(
                "/api/patient/visits/2021-11-14/"
              );
              console.log(res);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          Click me
        </Button>
      </main>
    </>
  );
};

const Item = (props) => {
  return (
    <div>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>
    </div>
  );
};

export default CallView;
