import "./App.css";
import LocalPlayer from "./components/CameraPlayer/LocalPlayer";
import RemotePlayer from "./components/CameraPlayer/RemotePlayer";
import NavBar from "./components/NavigationBar/NavBar";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { accountActions } from "./stores/redux-store/slices/auth-slice";
import authAxios from "./Auth/auth-axios";

const App = () => {
  return (
    <>
      <div>It's not working!</div>
    </>
  );
};

export default App;
