import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  isAuthenticated: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialAuthState,
  reducers: {
    updateTokens(state, action) {
      console.log("Tokens updated");
      console.log(action);
      localStorage.setItem("access_token", action.payload.access);
      localStorage.setItem("refresh_token", action.payload.refresh);
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
    },
    updateIsAuthenticated(state, action) {
      console.log("Auth updated");
      state.isAuthenticated = true;
    },
    updateUserData(state, action) {
      state.firstName = action.firstName;
      state.middleNames = action.middleNames;
      state.lastName = action.lastName;
    },
    logout(state, action) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice;
