import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  fetchDoctorListThunk,
  getSignUpOTPThunk,
  verifySignUpOTPThunk,
  getLoginOTPThunk,
  verifyLoginOTPThunk,
  getDoctorAvailableDatesThunk,
  getDoctorAvailableSlotsByDateThunk,
  bookAppointmentThunk,
  savePatientDetailsThunk,
  updatePatientDetailsThunk,
  rescheduleAppointmentThunk,
} from './HomeThunk';
import { act } from 'react';

const initialState = {
  showBackdrop: false,
  isUserLoggedIn: localStorage.getItem('access_token') ? true : false,
  userId: localStorage.getItem('regNo') || null,
  loginSignUpAction: 'signup',
  signUpLoading: false,
  signUpSuccess: '',
  signUpError: '',
  otpVerifySuccess: '',
  otpVerifyError: '',
  doctorListLoading: false,
  doctorList: [],
  doctorListError: '',
  registrationOTP: '',
  registrationNumber: '',
  patientDetails: [],
  userRole: '',

  // DoctorAvailble Dates
  doctorAvailableapiLoading: false,
  doctorAvailableDates: [],
  // Doctor Availabel Time Slots
  doctorAvailableTimeSlots: [],
  // SELECTED DOCTOR LIST
  selectedDoctor: null,
  // Booking confirmation
  bookedDoctorDetails: [],
  // CALL appointment API
  callAppointment: false,
  // Booking invoice data
  bookingAmount: null,
  bookingReason: '',
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    updateloginSignupAction: (state, action) => {
      console.log(action, 'Action');
      state.loginSignUpAction = action.payload;
    },
    updateSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    updateUserLogin: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
    updateBackdrop: (state, action) => {
      state.showBackdrop = action.payload;
    },
    updateAppointment: (state, action) => {
      state.callAppointment = action.payload;
    },
    updateBookingAmount: (state, action) => {
      state.bookingAmount = action.payload;
    },
    updateBookingReason: (state, action) => {
      state.bookingReason = action.payload;
    },
    updateBookingPaymentStatus: (state, action) => {
      if (state.bookedDoctorDetails) {
        state.bookedDoctorDetails.paymentStatus = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH_DOCTOR_LIST
      .addCase(fetchDoctorListThunk.pending, (state) => {
        state.doctorListLoading = true;
      })
      .addCase(fetchDoctorListThunk.fulfilled, (state, action) => {
        state.doctorListLoading = false;
        state.doctorList = action.payload;
      })
      .addCase(fetchDoctorListThunk.rejected, (state, action) => {
        state.doctorListLoading = false;
        state.doctorList = [];
        console.log(action, 'action');
        state.doctorListError = action.error.errorMessage;
      })
      // GET_SIGN_UP_OTP
      .addCase(getSignUpOTPThunk.pending, (state, action) => {
        state.signUpLoading = true;
      })
      .addCase(getSignUpOTPThunk.fulfilled, (state, action) => {
        state.signUpSuccess = action.payload;
        state.signUpLoading = false;
      })
      .addCase(getSignUpOTPThunk.rejected, (state, action) => {
        console.log(action.error, 'Erro');
        state.signUpError = action.error.message;
        state.signUpLoading = false;
      })
      // VERIFY_SIGN_UP_OTP
      .addCase(verifySignUpOTPThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(verifySignUpOTPThunk.fulfilled, (state, action) => {
        const tokenObject = JSON.parse(action.payload.token);
        const accessToken = tokenObject.access_token;
        const refreshToken = tokenObject.refresh_token;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('regNo', action.payload.regNo);
        try {
          const base64payload = accessToken.split('.')[1];
          const decodePayload = JSON.parse(atob(base64payload));
          const roles = decodePayload.realm_access?.roles || [];
          const allowedRoles = ['PATIENT', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'LAB-TECHNICIAN'];
          const userRole = roles.find((role) => allowedRoles.includes(role.toUpperCase()));
          if (userRole) {
            localStorage.setItem('user_role', userRole.toUpperCase());
            state.userRole = userRole.toUpperCase();
          } else {
            console.warn('No matching role found in token payload:', roles);
          }
        } catch (e) {
          console.log('Failed to decode user role', e);
        }
        state.registrationNumber = action.payload.regNo;
        state.otpVerifySuccess = action.payload;
        state.showBackdrop = false;
      })
      .addCase(verifySignUpOTPThunk.rejected, (state, action) => {
        state.otpVerifyError = action.payload;
        state.showBackdrop = false;
      })
      // SAVE_PATIENT_DETAILS
      .addCase(savePatientDetailsThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(savePatientDetailsThunk.fulfilled, (state, action) => {
        state.showBackdrop = false;
        state.otpVerifyError = action.payload;
        state.isUserLoggedIn = true;
      })
      .addCase(savePatientDetailsThunk.rejected, (state, action) => {
        state.showBackdrop = false;
      })
      // GET_LOGIN_OTP
      .addCase(getLoginOTPThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(getLoginOTPThunk.fulfilled, (state, action) => {
        state.showBackdrop = false;
      })
      .addCase(getLoginOTPThunk.rejected, (state, action) => {
        state.showBackdrop = false;
      })
      //VERIFY_LOGIN_OTP
      .addCase(verifyLoginOTPThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(verifyLoginOTPThunk.fulfilled, (state, action) => {
        const tokenObject = JSON.parse(action.payload.token);

        // Extract the access_token
        const accessToken = tokenObject.access_token;
        const refreshToken = tokenObject.refresh_token;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('regNo', action.payload.regNo);
        try {
          const base64payload = accessToken.split('.')[1];
          const decodePayload = JSON.parse(atob(base64payload));
          const roles = decodePayload.realm_access?.roles || [];
          const allowedRoles = ['PATIENT', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'LAB-TECHNICIAN'];
          const userRole = roles.find((role) => allowedRoles.includes(role.toUpperCase()));
          if (userRole) {
            localStorage.setItem('user_role', userRole.toUpperCase());
            state.userRole = userRole.toUpperCase();
          } else {
            console.warn('No matching role found in token payload:', roles);
          }
        } catch (e) {
          console.log('Failed to decode user role', e);
        }
        state.showBackdrop = false;
        state.isUserLoggedIn = true;
      })
      .addCase(verifyLoginOTPThunk.rejected, (state, action) => {
        state.otpVerifyError = action.payload;
        state.showBackdrop = false;
      })
      // GET_DOCTOR AVAILABLE DATES
      .addCase(getDoctorAvailableDatesThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(getDoctorAvailableDatesThunk.fulfilled, (state, action) => {
        state.doctorAvailableDates = action.payload;
        state.showBackdrop = false;
      })
      .addCase(getDoctorAvailableDatesThunk.rejected, (state, action) => {
        state.showBackdrop = false;
      })
      // GET DOCTOR AVAILABLE SLOTS
      .addCase(getDoctorAvailableSlotsByDateThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(getDoctorAvailableSlotsByDateThunk.fulfilled, (state, action) => {
        state.doctorAvailableTimeSlots = action.payload;
        state.showBackdrop = false;
      })
      .addCase(getDoctorAvailableSlotsByDateThunk.rejected, (state, action) => {
        state.showBackdrop = false;
        state.doctorAvailableTimeSlots = [];
      })
      // UPDATE PATIENT PROFILE
      .addCase(updatePatientDetailsThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(updatePatientDetailsThunk.fulfilled, (state, action) => {
        state.patientDetails = action.payload;
        state.showBackdrop = false;
      })
      .addCase(updatePatientDetailsThunk.rejected, (state, action) => {
        state.showBackdrop = false;
      })
      //  BOOK DOCTOR  appoinment
      .addCase(bookAppointmentThunk.pending, (state, action) => {
        state.showBackdrop = true;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.bookedDoctorDetails = action.payload;
        state.showBackdrop = false;
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.showBackdrop = false;
      });
  },
});

// Export the actions
export const {
  updateloginSignupAction,
  updateSelectedDoctor,
  updateUserLogin,
  updateBackdrop,
  updateAppointment,
  updateBookingAmount,
  updateBookingReason,
  updateBookingPaymentStatus,
} = homeSlice.actions;

export default homeSlice.reducer;
