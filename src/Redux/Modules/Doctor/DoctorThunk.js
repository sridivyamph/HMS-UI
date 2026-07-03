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
    const data = await fetchDoctorAppointments(payload.param, payload.filter, payload.page, payload.size);
    return data;
  }
)
export const fetchDoctorPreviousAppointmentsList = createAsyncThunk(
  'doctor/fetchDoctorPreviousAppointmentsList',
  async(payload) => {
    const data = await fetchDoctorAppointments(payload.param, payload.filter, payload.page, payload.size);
    return data;
  }
)