import axios from 'axios';

const BASE_URL = '/config';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const UNAUTHENTICATED_ROUTES = [
  '/api/doctor/all',
  '/unauth/register',
  '/unauth/verify-otp',
  '/unauth/login',
  '/unauth/login-verify-otp/3',
  '/api/authenticate/3/login',
];

let loggingOut = false;

api.interceptors.request.use(
  (config) => {
    const isUnprotectedRoute = UNAUTHENTICATED_ROUTES.some((route) => config.url.includes(route));
    let accessToken = localStorage.getItem('access_token');
    if (!isUnprotectedRoute && accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnprotectedRoute = UNAUTHENTICATED_ROUTES.some((route) =>
      originalRequest.url.includes(route)
    );

    if (error.response?.status === 401 && !isUnprotectedRoute && !originalRequest._retry) {
      originalRequest._retry = true;

      if (loggingOut) {
        return Promise.reject(error);
      }

      const latestRefreshToken = localStorage.getItem('refresh_token');
      if (!latestRefreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        if (loggingOut) {
          return Promise.reject(error);
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${BASE_URL}/unauth/refresh`, {
          refreshToken: latestRefreshToken,
        });

        if (response.status !== 200) {
          throw new Error('Refresh token request failed');
        }

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (!loggingOut) {
          logoutUser();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const logoutUser = () => {
  if (loggingOut) return;
  loggingOut = true;
  console.log('Logging out due to inactivity');
  const userType = localStorage.getItem('user_role');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('regNo');
  localStorage.removeItem('isDoctorLogin');
  localStorage.removeItem('isReceptionLogin');
  const loginPaths = {
    ADMIN: '/admin/login',
    PATIENT: '/patient/login',
    DOCTOR: '/doctor/login',
    RECEPTIONIST: '/reception/login',
    'LAB-TECHNICIAN': '/lab/login',
  };
  const base = window.location.href.split('#')[0];
  window.location.href = base + '#' + (loginPaths[userType] || '/');
};

export default api;
