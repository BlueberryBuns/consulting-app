const initialCameraSetup = {
  audio: true,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
    frameRate: 30,
    facingMode: "environment",
  },
};

export default initialCameraSetup;
