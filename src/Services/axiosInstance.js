import axios from 'axios';

const BASE_URL = '/api/config';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retrieve tokens from local storage

let refreshToken = localStorage.getItem('refresh_token');

// Define API routes that DON'T need authentication
const UNAUTHENTICATED_ROUTES = [
  '/api/doctor/all',
  '/unauth/register',
  '/unauth/verify-otp',
  '/unauth/login',
  '/unauth/login-verify-otp/3',
  '/api/authenticate/3/login',
];

// **Attach Token Only for Protected Routes**
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
// Handle Token Expiry & Refresh**

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check: is this request protected?
    const isUnprotectedRoute = UNAUTHENTICATED_ROUTES.some((route) =>
      originalRequest.url.includes(route)
    );

    // ✅ Only try refresh if:
    // 1. Response is 401
    // 2. The request was protected
    // 3. Not already retried
    if (error.response?.status === 401 && !isUnprotectedRoute && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const latestRefreshToken = localStorage.getItem('refresh_token');

        if (!latestRefreshToken) {
          console.error('No refresh token found, logging out...');
          logoutUser();
          return Promise.reject(error);
        }

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

        // Retry original
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    // For unprotected routes or other 401s → pass error back
    return Promise.reject(error);
  }
);

const logoutUser = () => {
  console.log('Logging out due to inactivity');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  const userType = localStorage.getItem('user_role');
  switch (userType) {
    case 'ADMIN':
      window.location.href = '/#/admin/login';
      break;
    case 'PATIENT':
      window.location.href = '/#/patient/login';
      break;
    case 'DOCTOR':
      window.location.href = '/#/doctor/login';
      break;
    case 'RECEPTIONIST':
      window.location.href = '/#/reception/login';
      break;
    case 'LAB-TECHNICIAN':
      window.location.href = '/#/lab/login';
      break;
    default:
      window.location.href = '/#'; // fallback
  }
};

export default api;
