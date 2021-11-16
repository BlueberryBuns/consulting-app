import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Application from "./layouts/Application/Application";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import reduxStore from "./stores/redux-store/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import configureMediaStore from "./stores/custom-store/media-store";
configureMediaStore();

const theme = createTheme();

const routing = (
  <ThemeProvider theme={theme}>
    <Provider store={reduxStore}>
      <CookiesProvider>
        <Application />
      </CookiesProvider>
    </Provider>
  </ThemeProvider>
);

ReactDOM.render(routing, document.getElementById("root"));
