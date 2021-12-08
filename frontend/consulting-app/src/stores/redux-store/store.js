import { configureStore } from "@reduxjs/toolkit";

import accountSlice from "./slices/auth-slice";
import visitSlice from "./slices/visit-slice";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    visit: visitSlice.reducer,
  },
});

export default store;
