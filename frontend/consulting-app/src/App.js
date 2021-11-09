import "./App.css";
import LocalPlayer from "./components/CameraPlayer/LocalPlayer";
import RemotePlayer from "./components/CameraPlayer/RemotePlayer";
import NavBar from "./components/NavigationBar/NavBar";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { accountActions } from "./stores/redux-store/slices/auth-slice";
import authAxios from "./Auth/auth-axios";

const App = () => {
  const authState = useSelector((state) => state.account);
  const dispatch = useDispatch();
  console.log("User authenticated: ", authState.isAuthenticated);
  useEffect(async () => {
    if (!authState.isAuthenticated) {
      if (authState.accessToken) {
        try {
          const response = await authAxios.post("/users/token/verify", {
            token: authState.accessToken,
          });
          if (response.statusText === "OK") {
            console.log(response);
            console.log("Saved token is valid, authorising user");
            dispatch(accountActions.updateIsAuthenticated());
            return;
          }
        } catch (err) {
          console.log(err);
          try {
            const responseRefresh = await authAxios.post(
              "/users/token/refresh",
              {
                refresh: authState.refreshToken,
              }
            );

            // Rotate access and refresh tokens
            console.log(responseRefresh);
            console.log("Refreshed Token");
            dispatch(accountActions.updateTokens(responseRefresh.data));
          } catch (error) {
            console.log(error);
            dispatch(accountActions.logout());
          }
        }
      }
    }
    // return () => {
    //   cleanup;
    // };
  }, []);
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
