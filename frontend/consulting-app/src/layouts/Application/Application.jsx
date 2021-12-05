import { ThemeProvider, createTheme } from "@mui/material";
import MeetingsView from "../../layouts/Application/Meetings";
import CallView from "../../layouts/Application/Call";
// import Login from "../../layouts/Application/Account";
import Cam from "../../App";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import SignInSide from "./TempLogin";
import NavigationBar from "../../components/NavBar/NavBar";
import {
  PatientRoute,
  DoctorRoute,
  AdminRoute,
  ModeratorRoute,
} from "../RouteTypes/RouteTypes";
import { DoctorModule } from "./DoctorModule";
import { ModeratorModule } from "./ModeratorModule";
import { PatientModule } from "./PatientModule";
import UnauthorisedModule from "./UnauthorisedApp";
import authAxios from "../../Auth/auth-axios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { accountActions } from "../../stores/redux-store/slices/auth-slice";

const theme = createTheme({});

const Application = () => {
  const authState = useSelector((state) => state.account);
  const dispatch = useDispatch();
  console.log("User authenticated: ", authState.isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.isAuthenticated) {
        if (authState.accessToken) {
          try {
            const response = await authAxios.post("/api/token/verify/", {
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
                "/api/token/refresh/",
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
    };

    fetchData();
    // return () => {
    //   cleanup;
    // };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavigationBar />
        <Switch>
          <UnauthorisedModule />
          <PatientRoute
            exact
            path="/patient"
            render={(props) => <PatientModule {...props} />}
          />
          <DoctorRoute
            exact
            path="/doctor"
            render={(props) => <DoctorModule {...props} />}
          />
          <ModeratorRoute
            exact
            path="/moderator"
            render={(props) => <ModeratorModule {...props} />}
          />

          {/* <Route
            exact
            path="/"
            render={(props) => <LandingPageTMP {...props} />}
          />
          <Route path="/camera" render={(props) => <CallView {...props} />} />
          <Route path="/camera2" render={(props) => <Cam {...props} />} />
          <Route path="/login" render={(props) => <Login {...props} />} />
          <Route path="/login2" render={(props) => <SignInSide {...props} />} />
          <Route path="/register" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/meetings"
            render={(props) => <MeetingsView {...props} />}
          />
          <Route
            path="/meetings/:meetingId"
            render={(props) => <MeetingsView {...props} />}
          />*/}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Application;
