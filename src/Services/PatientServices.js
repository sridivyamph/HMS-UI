import api from './axiosInstance';

// GET GENERAL CONFIG
export const fetchConfig = () => {
  return api.get(`unauth/configurations?domainName=local`, {});
};

export const fetchDoctorList = async (pagination, data) => {
  const { page, size } = pagination;
  const response = await api.post(`/api/doctor/all?page=${page}&size=${size}`, data);
  return response.data;
};

export const getSignUpOTP = async (payload) => {
  const response = await api.post('/unauth/register', payload);
  return response.data;
};

export const verifySignUpOTP = async (payload) => {
  const response = await api.post('/unauth/verify-otp', payload);
  return response.data;
};

export const getLoginOTP = async (payload) => {
  const response = await api.post('/unauth/login', payload);
  return response.data;
};

export const verifyLoginOTP = async (payload) => {
  const response = await api.post('/unauth/login-verify-otp/3', payload);
  return response.data;
};

export const getDoctorAvailableDates = async (payload) => {
  const response = await api.get(`/api/doctor/${payload.doctorId}/appointment-dates`, {});
  return response.data;
};

export const getDoctorAvailableSlotsByDate = async (payload) => {
  const response = await api.get(
    `/api/doctor/schedule/${payload.doctorId}?scheduleDate=${payload.date}`,
    {}
  );
  return response.data;
};

export const bookAppointment = async (payload) => {
  const response = await api.post('/api/doctor/book-appointment', payload, {});
  return response.data;
};
// Cancel Appointment
export const cancelAppointment = async ({ payload, param }) => {
  const response = await api.put(`/api/doctor/update-appointment/${param}`, payload, {});
  return response.data;
};

export const savePatientDetails = async (param, payload) => {
  const response = await api.put(`/users/update/${param}`, payload, {});
  return response.data;
};

export const getUserDetails = (payload) => {
  return api.get(`/users/profile/${payload.param}`, {});
};

export const getAllUserAppointment = (payload) => {
  return api.get(`/users/profile/${payload.param}/appointments?type=all&page=${payload.page}&size=10`);
};

export const getUserAppointment = (payload) => {
  return api.get(`/users/profile/${payload.param}/appointments?type=all`, {});
};
export const getPatientProfileById = (id) => {
  return api.get(`/users/profile/${id}`, {});
};

export const updatePatientProfile = (id, payload) => {
  return api.put(`/users/update/${id}`, payload, {});
};

// PAYMENT API
export const createOrder = (payload) => {
  return api.post(`api/v1/razorpay/create-order`, payload, {});
};

export const paymentConfirmation = (payload) => {
  return api.post(`api/v1/razorpay/webhook/confirmPayment`, payload, {});
};

export const retryPayment = (payload) => {
  return api.post(`api/v1/razorpay/retry-payment/${payload.param}`, {});
};

export const getPatientLabReportById = (param) => {
  return api.get(`/api/lab-reports/all/${param}`);
};

export const updatePaymentStatusAtHospital = (payload) => {
  return api.put(`api/reception/${payload.param}/payment-status`, {});
};
