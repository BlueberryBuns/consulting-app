import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  doctorId: null,
  patientId: null,
};

const visitSlice = createSlice({
  name: "visit",
  initialState: initialAuthState,
  reducers: {
    updateDoctor(state, action) {
      state.doctorId = action.payload.doctorId;
    },
    updatePatient(state, action) {
      state.patientId = action.payload.patientId;
    },
  },
});

export const visitActions = visitSlice.actions;

export default visitSlice;
