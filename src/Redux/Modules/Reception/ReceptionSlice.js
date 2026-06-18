import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  fetchUpcommingAppointmentList,
  fetchPreviousAppointmentList,
  receptionLoginCall,
  saveNewPatientInfo,
  sendOtp,
  appUserDataCall,
  appUserIdCall,
} from "./ReceptionThunk";

const initialState = {
  isLoading: false,
  upcomingAppointmentList: [],
  previousAppointmentList: [],
  isPatientInfoSuccess: "",
  isLoginSuccess: false,
  isOtpVerified: false,
  isErrorFound: false,
  isNavigate: false,
  isOtpRequired: false,
  isUserCreated: false,
  selectedDoctorRec: {},
  userId: null,
  receptionData: null,
  selectedDate: "",
};

export const receptionSlice = createSlice({
  name: "reception",
  initialState,
  reducers: {
    updateReceptionTokenAction: (state, action) => {
      state.receptionToken = action.payload;
    },
    updateSelectedDoctorRec: (state, action) => {
      state.selectedDoctorRec = action.payload;
    },
    updateReceptionLogin: (state, action) => {
      state.isReceptionLogin = action.payload;
    },
    clearReceptionCache: (state, action) => {
      state.isOtpRequired = false;
      state.isUserCreated = false;
      state.selectedDoctorRec = {};
      state.selectedDate = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH_DOCTOR_LIST
      .addCase(fetchUpcommingAppointmentList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUpcommingAppointmentList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingAppointmentList = action.payload?.content;
      })
      .addCase(fetchUpcommingAppointmentList.rejected, (state, action) => {
        state.isLoading = false;
        state.previousAppointmentList = [];
      })
      .addCase(fetchPreviousAppointmentList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPreviousAppointmentList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.previousAppointmentList = action.payload?.content;
      })
      .addCase(fetchPreviousAppointmentList.rejected, (state, action) => {
        state.isLoading = false;
        state.previousAppointmentList = [];
      })

      // LOGIN_RECEPTIONIST
      // .addCase(receptionLoginCall.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(receptionLoginCall.fulfilled, (state, action) => {
      //   const tokenObject = JSON.parse(action?.payload.jwtToken);
      //   localStorage.setItem("access_token", tokenObject?.access_token);
      //   localStorage.setItem("refresh_token", tokenObject?.refresh_token);
      //   state.isLoading = false;
      //   state.isLoginSuccess = action.payload;
      //   state.isNavigate = true;
      //   state.isErrorFound = false;
      //   const accessToken = tokenObject.access_token;
      //   try {
      //     const base64payload = accessToken.split(".")[1];
      //     const decodePayload = JSON.parse(atob(base64payload));
      //     console.log(decodePayload);
      //     const userRole = decodePayload.realm_access.roles[0];
      //     console.log(userRole);
      //     localStorage.setItem("user_role", userRole);
      //     state.userRole = userRole;
      //   } catch (e) {
      //     console.log("Failed to decode user role", e);
      //   }
      // })
      // .addCase(receptionLoginCall.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isLoginSuccess = false;
      //   state.isErrorFound = true;
      // })

      //SAVE_PATIENT_INFO
      .addCase(saveNewPatientInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveNewPatientInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPatientInfoSuccess = action.payload;
        state.isOtpRequired = true;
      })
      .addCase(saveNewPatientInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isPatientInfoSuccess = [];
      })

      // Send Otp
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOtpVerified = action.payload;
        state.isUserCreated = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isOtpVerified = false;
      })

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
        state.receptionData = action?.payload;
        // console.log(action?.payload);
        state.isLoading = false;
        state.isErrorFound = false;
      })
      .addCase(appUserDataCall.rejected, (state) => {
        state.isLoading = false;
        state.isErrorFound = true;
      });
  },
});

// Export the actions
export const {
  updateloginSignupAction,
  updateSelectedDoctor,
  updateReceptionTokenAction,
  updateSelectedDoctorRec,
  updateReceptionLogin,
  clearReceptionCache,
} = receptionSlice.actions;

export default receptionSlice.reducer;
