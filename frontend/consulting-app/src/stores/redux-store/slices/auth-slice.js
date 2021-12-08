import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  isAuthenticated: false,
  isDoctor: false,
  isModerator: false,
  isAdmin: false,
  firstName: null,
  lastName: null,
  userId: localStorage.getItem("user_id"),
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
      localStorage.setItem("user_id", action.payload.userId);
      switch (action.payload.role) {
        case 5:
          state.isAdmin = true;
          break;
        case 4:
          state.isModerator = true;
          break;
        case 3:
          state.isDoctor = true;
          break;
        case 2:
          break;
        case 1:
          break;
        default:
          break;
      }
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
    },
    updateIsAuthenticated(state, action) {
      console.log("Auth updated");
      switch (action.payload.role) {
        case 5:
          state.isAdmin = true;
          break;
        case 4:
          state.isModerator = true;
          break;
        case 3:
          state.isDoctor = true;
          break;
        case 2:
          break;
        case 1:
          break;
        default:
          break;
      }
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.isAuthenticated = true;
    },
    logout(state, action) {
      state.firstName = null;
      state.lastName = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAdmin = false;
      state.isModerator = false;
      state.isDoctor = false;
      state.isAuthenticated = false;
      state.userId = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
    },
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice;
