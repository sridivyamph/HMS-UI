import api from './axiosInstance';

export const getAllPatientsList = async (param) => {
  const response = await api.get(`/api/patients/search?${param}`);
  return response.data;
};

export const fetchPatientProfileByPhone = async (param) => {
  const phoneNumber = Number(param);
  if (isNaN(phoneNumber)) throw new Error('Invalid phone number');
  const response = await api.get(`/api/patients/search?searchText=${Number(param)}`);
  return response.data;
};

export const uploadReport = async (formData) => {
  const response = await api.post(`/api/lab-reports/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export const downloadReport = async (param) => {
  const response = await api.get(`/api/lab-reports/download/${param}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getFiles = async (param) => {
  const response = await api.get(`/api/lab-reports/patient/${param}`);
  return response.data;
};

export const getGenericReports = async (param, payload) => {
  const response = await api.get(
    `/api/lab-reports/listGenericReportsWithSearch?${param}&searchQuery=${payload}`
  );
  return response.data;
};

export const addGenericReports = async (param, payload) => {
  const response = await api.post(`/api/lab-reports/add-reports/${param}`, payload);
  console.log(response.data);
  return response.data;
};

export const getListedReportsList = async (param) => {
  const response = await api.get(`/api/lab-reports/all/${param}`);
  return response.data;
};

export const deleteReport = async (param) => {
  const response = await api.delete(`/api/lab-reports/delete/${param}`);
  return response.data;
};
