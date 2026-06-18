import { createSlice } from '@reduxjs/toolkit';
import {
  doctorLoginCall,
  appUserDataCall,
  fetchDoctorUpcomingAppointmentsList,
  fetchDoctorPreviousAppointmentsList,
} from './DoctorThunk';

const initialState = {
  originalId: '',
  isLoading: false,
  isLoginSuccess: false,
  isErrorFound: false,
  isNavigate: false,
  doctorData: [],
  upcomingAppointmentList: [],
  previousAppointmentList: [],
};

export const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    updateDoctorOriginalId: (state, action) => {
      state.originalId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorUpcomingAppointmentsList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorUpcomingAppointmentsList.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log(action)
        state.upcomingAppointmentList = action?.payload;
      })
      .addCase(fetchDoctorUpcomingAppointmentsList.rejected, (state, action) => {
        state.isLoading = false;
        state.upcomingAppointmentList = [];
      })
      .addCase(fetchDoctorPreviousAppointmentsList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorPreviousAppointmentsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.previousAppointmentList = action?.payload;
      })
      .addCase(fetchDoctorPreviousAppointmentsList.rejected, (state, action) => {
        state.isLoading = false;
        state.previousAppointmentList = [];
      })

      .addCase(appUserDataCall.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(appUserDataCall.fulfilled, (state, action) => {
        state.originalId = action?.payload.doctorId;
        state.doctorData = action?.payload;
        state.isLoading = false;
        state.isErrorFound = false;
      })
      .addCase(appUserDataCall.rejected, (state, action) => {
        state.isLoading = false;
        state.isErrorFound = true;
      });
  },
});
export const { updateDoctorOriginalId } = doctorSlice.actions;
export default doctorSlice.reducer;
