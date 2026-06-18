import api from './axiosInstance';

//doctor login
export const doctorLogin = async (payload) => {
  const response = await api.post('/api/authenticate/3/login', payload);
  return response.data;
};

export const updatePatientPrescription = async ({ param, payload }) => {
  const response = api.put(`/api/doctor/update-appointment/prescription/${param}`, payload);
  return response.data;
};

export const rescheduleAppointments = async ({ payload, param }) => {
  const response = await api.put(`/api/doctor/reschedule-appointment/${param}`, payload, {});
  return response.data;
};

export const fetchDoctorAppointments = async (param, filter) => {
  try {
    const response = await api.get(`/api/doctor/${param}/appointments?filter=${filter}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getAppUserId = async () => {
  const response = await api.get('/api/appUser/profile');
  return response.data;
};
export const getUserData = async ({ cloakId, hosId }) => {
  const response = await api.get(`/api/doctor/info/${hosId}/${cloakId}`);
  return response.data;
};

export const savePatientDetails = async (payload, param) => {
  const response = await api.put(`/users/update/${param}`, payload, {});
  return response.data;
};

export const getUserDetails = (payload) => {
  return api.get(`/users/profile/${payload.param}`, {});
};

export const getUserAppointment = (payload) => {
  return api.get(`/users/profile/${payload.param}/appointments?type=all`, {});
};

export const getPatientProfileById = (id) => {
  return api.get(`/users/profile/${id}`, {});
};

export const getDoctorVisitsAndConsults = async (param) => {
  const query = param ? `?${param}` : '';
  const response = await api.get(`/api/reception/visits-and-consults${query}`);
  return response.data;
};
