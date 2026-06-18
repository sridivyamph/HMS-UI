import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDoctorList,
  getSignUpOTP,
  verifySignUpOTP,
  getLoginOTP,
  verifyLoginOTP,
  getDoctorAvailableDates,
  getDoctorAvailableSlotsByDate,
  bookAppointment,
  savePatientDetails,
  updatePatientProfile,
} from '../../../Services/PatientServices';
import { rescheduleAppointments } from '../../../Services/DoctorServices';
import { setAuthState } from '../Slice/authSlice';

// Thunks
export const fetchDoctorListThunk = createAsyncThunk(
  'home/fetchDoctorList',
  async (payload) => await fetchDoctorList(payload.pagination, payload.data)
);

// export const getSignUpOTPThunk = createAsyncThunk(
//   'home/getSignUpOTP',
//   async (payload) => await getSignUpOTP(payload)
// );

export const getSignUpOTPThunk = createAsyncThunk(
  'home/getSignUpOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getSignUpOTP(payload);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // ✅ send custom API error
      }
      return rejectWithValue({ errorMessage: 'Something went wrong' });
    }
  }
);

// export const verifySignUpOTPThunk = createAsyncThunk(
//   'home/verifySignUpOTP',
//   async (payload) => await verifySignUpOTP(payload)
// );

export const verifySignUpOTPThunk = createAsyncThunk(
  'home/verifySignUpOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifySignUpOTP(payload);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        // Forward the full API error (e.g. { errorCode, errorMessage, httpCode, ... })
        return rejectWithValue(error.response.data);
      }

      // Fallback for unexpected errors
      return rejectWithValue({ errorMessage: 'Something went wrong' });
    }
  }
);

// export const getLoginOTPThunk = createAsyncThunk(
//   'home/getLoginOTP',
//   async (payload) => await getLoginOTP(payload)
// );

export const getLoginOTPThunk = createAsyncThunk(
  'home/getLoginOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const responseData = await getLoginOTP(payload); // already response.data

      // 🔍 Check the message content manually
      if (
        responseData.message &&
        responseData.message.toLowerCase().includes('user does not exist')
      ) {
        return rejectWithValue({
          errorMessage: responseData.message || 'User not found.',
        });
      }

      return responseData; // Success
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({ errorMessage: 'Something went wrong.' });
    }
  }
);

export const verifyLoginOTPThunk = createAsyncThunk(
  'home/verifyLoginOTP',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const result = await verifyLoginOTP(payload);
      dispatch(setAuthState({ role: 'PATIENT' }));
      return result;
    } catch (error) {
      if (error.response && error.response.data) {
        // Forward the full API error (e.g. { errorCode, errorMessage, httpCode, ... })
        return rejectWithValue(error.response.data);
      }

      // Fallback for unexpected errors
      return rejectWithValue({ errorMessage: 'Something went wrong' });
    }
  }
);

export const getDoctorAvailableDatesThunk = createAsyncThunk(
  'home/getDoctorAvailableDates',
  async (payload) => await getDoctorAvailableDates(payload)
);

export const getDoctorAvailableSlotsByDateThunk = createAsyncThunk(
  'home/getDoctorAvailableSlotsByDate',
  async (payload) => await getDoctorAvailableSlotsByDate(payload)
);

export const bookAppointmentThunk = createAsyncThunk(
  'home/bookAppointment',
  async (payload) => await bookAppointment(payload)
);
export const rescheduleAppointmentThunk = createAsyncThunk(
  'home/rescheduleAppointment',
  async (args) => {
    return await rescheduleAppointments(args);
  }
);

export const savePatientDetailsThunk = createAsyncThunk(
  'home/savePatientDetails',
  async ({ param, payload }) => await savePatientDetails(param, payload)
);

export const updatePatientDetailsThunk = createAsyncThunk(
  'home/updatePatientDetails',
  async ({ param, payload }) => await updatePatientProfile(param, payload)
);
