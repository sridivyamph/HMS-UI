import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchConfig } from '../../../Services/PatientServices';

//A common login handler and role finder
const initialState = {
  userRole: localStorage.getItem('user_role'),
  appConfig: null,
  isConfigLoaded: false,
};

export const fetchConfigThunk = createAsyncThunk('auth/fetchConfig', async () => {
  const response = await fetchConfig();
  return response.data;
});

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { role } = action.payload;
      state.userRole = role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigThunk.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(fetchConfigThunk.fulfilled, (state, action) => {
        state.appConfig = action.payload;
        state.isConfigLoaded = true;
      })
      .addCase(fetchConfigThunk.rejected, (state, action) => {
        state.isConfigLoaded = true;
        state.appConfig = { hospitalId: 3 };
      });
  },
});

export const { setAuthState, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
