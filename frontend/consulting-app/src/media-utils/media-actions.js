const switchCameraStatus = (currentState, payload) => {
  const newCameraState = !currentState.mediaUtils?.isCameraEnabled;
  const newMediaUtils = {
    ...currentState.mediaUtils,
    isCameraEnabled: newCameraState,
  };
  currentState.mediaStream?.getVideoTracks().forEach((track) => {
    track.enabled = newCameraState;
  });
  return { mediaUtils: newMediaUtils };
};

const switchAudioStatus = (currentState, payload) => {
  const newMicrphoneState = !currentState.mediaUtils?.isMicrophoneEnabled;
  const newMediaUtils = {
    ...currentState.mediaUtils,
    isMicrophoneEnabled: newMicrphoneState,
  };
  currentState.mediaStream?.getAudioTracks().forEach((track) => {
    track.enabled = newMicrphoneState;
  });
  return { mediaUtils: newMediaUtils };
};

const updateMediastream = (currentState, newStream) => {
  console.log("UPDATED MEDIASTREAM");
  const newMediaState = {
    mediaStream: newStream,
  };
  console.log(newMediaState);

  return newMediaState;
};

const media_object = {
  switchCameraStatus,
  switchAudioStatus,
  updateMediastream,
};

export default media_object;
