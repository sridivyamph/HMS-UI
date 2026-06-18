import { createAsyncThunk } from '@reduxjs/toolkit';

import { doctorLogin, getAppUserId, getUserData, fetchDoctorAppointments } from '../../../Services/DoctorServices';

export const doctorLoginCall = createAsyncThunk(
  'doctor/doctorLogin',
  async (payload) => await doctorLogin(payload)
);

export const appUserIdCall = createAsyncThunk(
  'doctor/userIdCall',
  async() => await getAppUserId()
)
export const appUserDataCall = createAsyncThunk(
  'doctor/userDataCall',
  async(param) => await getUserData(param.cloakId,param.hosId)
)

export const fetchDoctorUpcomingAppointmentsList = createAsyncThunk(
  'doctor/fetchDoctorUpcomingAppointmentsList',
  async(payload) => {
    console.log(payload.param)
    const data = await fetchDoctorAppointments(payload.param, payload.filter);
    return data;
  }
)
export const fetchDoctorPreviousAppointmentsList = createAsyncThunk(
  'doctor/fetchDoctorPreviousAppointmentsList',
  async(payload) => {
    console.log(payload.param)
    const data = await fetchDoctorAppointments(payload.param, payload.filter);
    return data;
  }
)