import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  displayUserData: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState: initialAuthState,
  reducers: {
    updateTokens(state, action) {
      state.accessToken = action.accessToken;
    },
    updateUserData() {},
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice;
