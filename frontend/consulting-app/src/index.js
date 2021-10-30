import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./layouts/Application/App";
import MeetingsView from "./layouts/Application/Meetings";
import Cam from "./App";
import Login from "./layouts/Application/Account";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import reduxStore from "./stores/redux-store/store";

import configureMediaStore from "./stores/custom-store/media-store";
configureMediaStore();

const routing = (
  <Provider store={reduxStore}>
    <CookiesProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <App {...props} />} />
          <Route path="/camera" render={(props) => <Cam {...props} />} />
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
    </CookiesProvider>
  </Provider>
);

ReactDOM.render(routing, document.getElementById("root"));
