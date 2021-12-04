import { ThemeProvider, createTheme } from "@mui/material";
import MeetingsView from "../../layouts/Application/Meetings";
import CallView from "../../layouts/Application/Call";
import Login from "../../layouts/Application/Account";
import Cam from "../../App";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import SignInSide from "./TempLogin";
import LandingPageTMP from "./LandingPageTMP";
import NavigationBar from "../../components/NavBar/NavBar";

const theme = createTheme({});

const Application = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <BrowserRouter>
        <Switch>
          <Route
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
          />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Application;
