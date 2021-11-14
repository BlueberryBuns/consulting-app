import App from "../../layouts/Application/App";
import MeetingsView from "../../layouts/Application/Meetings";
import CallView from "../../layouts/Application/Call";
import Login from "../../layouts/Application/Account";
import Cam from "../../App";
import { Route, Switch, BrowserRouter } from "react-router-dom";

const Application = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={(props) => <App {...props} />} />
        <Route path="/camera" render={(props) => <Cam {...props} />} />
        <Route path="/camera2" render={(props) => <CallView {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
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
  );
};

export default Application;
