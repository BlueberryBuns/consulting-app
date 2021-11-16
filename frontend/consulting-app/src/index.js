import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./layouts/Application/Application";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import reduxStore from "./stores/redux-store/store";

import configureMediaStore from "./stores/custom-store/media-store";
configureMediaStore();

const routing = (
  <Provider store={reduxStore}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>
);

ReactDOM.render(routing, document.getElementById("root"));
