import { initStore } from "./store";
import mediaActions from "../../media-utils/media-actions";
const configureStore = () => {
  const actions = {
    SWITCH_CAMERA_STATUS: mediaActions.switchCameraStatus,
    SWITCH_AUDIO_STATUS: mediaActions.switchAudioStatus,
    UPDATE_MEDIASTREAM: mediaActions.updateMediastream,
  };

  initStore(actions, {
    mediaStream: undefined,
    mediaUtils: {
      isMicrophoneEnabled: true,
      isCameraEnabled: true,
      isUpdated: false,
    },
  });
};

export default configureStore;
