import api from './axiosInstance';

export const fetchReceptionAppointment = async (param, data) => {
  const response = await api.post(`/api/reception/appointments?${param}`, data);
  return response.data;
};

export const getAppUserId = async () => {
  const response = await api.get('/api/appUser/profile');
  return response.data;
};
export const getUserData = async (payload) => {
  const response = await api.get(`/api/lab-reports/info/${payload.hosId}/${payload.cloakId}`);
  return response.data;
};
export const receptionLogin = async (param, payload) => {
  const response = await api.post(`/api/authenticate/${param}/login`, payload);
  return response.data;
};

export const savePatientInfo = async (payload) => {
  const response = await api.post('/users/register', payload);
  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await api.post('/users/verify-otp', payload);
  return response.data;
};

export const shortUpdatePatientProfile = async (param, payload) => {
  const response = await api.put(`/users/short-update/${param}`, payload);
  return response.data;
};

export const fetchPatientProfileByPhone = async (param) => {
  const phoneNumber = Number(param);
  if (isNaN(phoneNumber)) throw new Error('Invalid phone number');
  const response = await api.get(`/api/patients/search?searchText=${Number(param)}`);
  return response.data;
};

export const updateCashPaymentStatus = async (payload, param) => {
  var response = await api.patch(`/api/reception/${param}/payment-status`, payload);
  return response.data;
};

export const getVisitsAndConsults = async (param) => {
  const endpoint = /^\d{4}-\d{2}-\d{2}$/.test(param)
    ? `/api/reception/visits-and-consults?date=${param}`
    : `/api/reception/visits-and-consults?timeRange=${param}`;

  const response = await api.get(endpoint);
  return response.data;
};

export const getMonthlyVisitors = async (monthYearRange) => {
  const response = await api.get(
    `/api/reception/visitors/monthly?monthYearRange=${encodeURIComponent(monthYearRange)}`
  );
  return response.data;
};
