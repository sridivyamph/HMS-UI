  import api from './axiosInstance';

export const adminLogin = async (payload, param) => {
  const response = await api.post(`/api/authenticate/${param}/login`, payload);
  return response.data;
};

export const adminDoctorRegsitration = async (payload, param) => {
  const response = await api.post(`/api/admin/create-doctor-user`, payload);
  return response.data;
};

// api function
export const adminListUsers = async ({ page, size, searchQuery }) => {
  const response = await api.get(
    `/api/admin/listDoctorsAndStaffWithSearch?page=${page}&size=${size}&searchQuery=${
      searchQuery || ''
    }`
  );
  return response.data;
};

export const adminStaffRegsitration = async (payload, param) => {
  const response = await api.post(`/api/admin/staff/onboard`, payload);
  return response.data;
};

export const adminLoadDefaultfields = async () => {
  const response = await api.get(
    `api/admin/category-details?categoryType=DESG,DEPT,SPECTYPE,DOCTYPE`
  );
  return response.data;
};

export const getAllLocations = async () => {
  const response = await api.get('/all-locations');
  return response.data;
};
