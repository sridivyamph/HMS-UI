import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchReceptionAppointment,
  receptionLogin,
  savePatientInfo,
  shortUpdatePatientProfile,
  fetchPatientProfileByPhone,
  verifyOtp,
  getUserData,
  getAppUserId,
  updateCashPaymentStatus,
  getVisitsAndConsults,
  getMonthlyVisitors,
} from "../../../Services/ReceptionService";

// Thunks
export const fetchUpcommingAppointmentList = createAsyncThunk(
  "reception/fetchUpcomingReceptionAppointment",
  async (payload) =>
    await fetchReceptionAppointment(payload.param, payload.data)
);
export const fetchPreviousAppointmentList = createAsyncThunk(
  "reception/fetchPreviousReceptionAppointment",
  async (payload) =>
    await fetchReceptionAppointment(payload.param, payload.data)
);

export const appUserIdCall = createAsyncThunk(
  "reception/userIdCall",
  async () => await getAppUserId()
);
export const appUserDataCall = createAsyncThunk(
  "reception/userDataCall",
  async (param) => await getUserData(param)
);

export const receptionLoginCall = createAsyncThunk(
  "reception/receptionLogin",
  async (param, payload) => await receptionLogin(param, payload)
);

export const saveNewPatientInfo = createAsyncThunk(
  "reception/savePatientInfo",
  async (payload) => await savePatientInfo(payload)
);

export const sendOtp = createAsyncThunk(
  "reception/verifyOtp",
  async (payload) => await verifyOtp(payload)
);

export const shortUpdatePatientInfo = createAsyncThunk(
  "reception/shortUpdatePatientProfile",
  async (payload) => {
    await shortUpdatePatientProfile(payload.param, payload.data);
  }
);

export const fetchPatientProfile = createAsyncThunk(
  "reception/fetchPatientProfileByPhone",
  async (payload) => {
    return await fetchPatientProfileByPhone(payload.param);
  }
);

export const updateCashPaymentStatusCall = createAsyncThunk(
  "reception/updateCashPaymentStatus",
  async (payload) => {
    return await updateCashPaymentStatus(payload.payload, payload.param);
  }
);

export const fetchVisitsAndConsults = createAsyncThunk(
  "reception/fetchVisitsAndConsults",
  async (queryParam, { rejectWithValue }) => {
    try {
      const data = await getVisitsAndConsults(queryParam);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Fetch failed");
    }
  }
);

export const fetchMonthlyVisitors = createAsyncThunk(
  "visitors/fetchMonthlyVisitors",
  async (monthYearRange, { rejectWithValue }) => {
    try {
      const data = await getMonthlyVisitors(monthYearRange);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch visitors data"
      );
    }
  }
);
