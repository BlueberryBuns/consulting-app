import "./App.css";
import LocalPlayer from "./components/CameraPlayer/LocalPlayer";
import RemotePlayer from "./components/CameraPlayer/RemotePlayer";
import NavBar from "./components/NavigationBar/NavBar";
import Box from "@mui/material/Box";

const App = () => {
  return (
    <>
      {/* <NavBar /> */}
      <LocalPlayer />
      <RemotePlayer />
      <Box
        sx={{
          width: 300,
          height: 300,
          backgroundColor: "text.primary",
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      />
    </>
  );
};

export default App;
