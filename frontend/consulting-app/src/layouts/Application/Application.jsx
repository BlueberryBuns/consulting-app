import App from "../../layouts/Application/App";
import MeetingsView from "../../layouts/Application/Meetings";
import CallView from "../../layouts/Application/Call";
import Login from "../../layouts/Application/Account";
import Cam from "../../App";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import SignInSide from "./TempLogin";
import LandingPageTMP from "./LandingPageTMP";
import LandingPage from "./LandingPage";
import { AppBar, Card, CardContent, Container, Grid } from "@mui/material";
import { Toolbar } from "@mui/material";
import MedService from "@mui/icons-material/MedicalServices";
import { Typography } from "@mui/material";
const Application = () => {
  return (
    <>
      <AppBar position="relative" style={{ background: "green" }}>
        <Toolbar>
          <MedService sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Consulting Application
          </Typography>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <LandingPageTMP {...props} />}
          />
          <Route
            exact
            path="/2"
            render={(props) => <LandingPage {...props} />}
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
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Application;
