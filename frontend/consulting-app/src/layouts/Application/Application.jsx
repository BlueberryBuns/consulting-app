import { ThemeProvider, createTheme } from "@mui/material";
// import MeetingsView from "../RestrictedViews/Meetings";
import CallView from "../RestrictedViews/Call";
// import Login from "../../layouts/Application/Account";
// import Cam from "../../App";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
// import SignInSide from "./TempLogin";
import NavigationBar from "../../components/NavBar/NavBar";
import {
  PatientRoutes,
  DoctorRoute,
  ModeratorRoute,
  PatRoute,
} from "../RouteTypes/RouteTypes";
import { Visits } from "../patient/Visits";
import { SelectDoctorPatient } from "../patient/SelectDoctor";
import { SelectDate } from "../patient/SelectDate";
import { DoctorVisits } from "./DoctorModule";
import { PatientModule } from "./PatientModule";
import UnauthorisedModule from "./UnauthorisedApp";
import LoginPage from "../UnrestrictedViews/LoginPage";
import RegisterPage from "../UnrestrictedViews/RegisterPage";
import LandingPage from "../UnrestrictedViews/LandingPage";
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
            const responseRole = await authAxios.get("/api/role/", {});
            if (response.statusText === "OK") {
              dispatch(accountActions.updateIsAuthenticated(responseRole.data));
            }
            return;
          } catch (err) {
            console.log(err);
            try {
              const responseRefresh = await authAxios.post(
                "/api/token/refresh/",
                {
                  refresh: authState.refreshToken,
                }
              );
              const responseRole = await authAxios.get("/api/role/", {});
              let data = { ...responseRefresh.data, ...responseRole.data };
              dispatch(accountActions.updateTokens(data));
            } catch (error) {
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
          <Route exact path="/" render={(props) => <LandingPage />} />
          <Route
            exact
            path="/login"
            render={(props) => <LoginPage {...props} />} //<LandingPageTMP {...props} />}
          />
          <Route
            exact
            path="/register"
            render={(props) => <RegisterPage {...props} />} //<LandingPageTMP {...props} />}
          />
          <Route
            exact
            path="/doctors"
            render={(props) => <div>Doctors</div>} //<LandingPageTMP {...props} />}
          />
          <Route path="/camera" render={(props) => <CallView {...props} />} />
          <Route path="/patient">
            {authState.isAuthenticated ? (
              <>
                <Route path="/patient/visits">
                  <Visits />
                </Route>
                <Route path="/patient/meeting/browse-doctors">
                  <SelectDoctorPatient />
                </Route>
                <Route path="/patient/meeting/select-date">
                  <SelectDate />
                </Route>
                <Route path="/patient/visit/consultation">
                  <SelectDate />
                </Route>
              </>
            ) : (
              <Redirect to="/camera" />
            )}
          </Route>

          {authState.isDoctor || authState.isAdmin ? (
            <Route path="/doctor/visits">
              <DoctorVisits />
            </Route>
          ) : (
            <Redirect to="/camera" />
          )}

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
