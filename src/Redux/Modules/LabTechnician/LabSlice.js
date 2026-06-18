// LabTechnicianSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { appUserDataCall, appUserIdCall } from "./LabThunk";

const initialState = {
  isLoading: false,
  isLoginSuccess: false,
  isErrorFound: false,
  isNavigate: false,
  userId: null,
  technicianData: null,
};

export const LabTechnicianSlice = createSlice({
  name: "LabTechnician",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(appUserIdCall.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(appUserIdCall.fulfilled, (state, action) => {
        state.userId = action?.payload?.userId;
        state.isLoading = false;
        state.isErrorFound = false;
      })
      .addCase(appUserIdCall.rejected, (state) => {
        state.isLoading = false;
        state.isErrorFound = true;
      })
      .addCase(appUserDataCall.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(appUserDataCall.fulfilled, (state, action) => {
        state.technicianData = action?.payload;
        state.isLoading = false;
        state.isErrorFound = false;
      })
      .addCase(appUserDataCall.rejected, (state) => {
        state.isLoading = false;
        state.isErrorFound = true;
      });
  },
});

export default LabTechnicianSlice.reducer;
