import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./layouts/Application/App";
import MeetingsView from "./layouts/Application/Meetings";
import Login from "./layouts/Application/Account";

import { CookiesProvider } from "react-cookie";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import configureMediaStore from "./custom-store/media-store";

configureMediaStore();

const routing = (
  <CookiesProvider>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={(props) => <App {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route
          path="/meetings"
          render={(props) => <MeetingsView {...props} />}
        />
      </Switch>
    </BrowserRouter>
  </CookiesProvider>
);

ReactDOM.render(routing, document.getElementById("root"));
