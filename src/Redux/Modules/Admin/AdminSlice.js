import { createSlice } from '@reduxjs/toolkit';
import { listUsersThunk } from './AdminThunk';

const initialState = {
  userList: [],
  loading: false,
  pagination: { page: 0, size: 10 },
  searchText: '',
  debouncedText: '',
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setDebouncedText: (state, action) => {
      state.debouncedText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(listUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(listUsersThunk.rejected, (state) => {
        state.loading = false;
        state.userList = [];
      });
  },
});

export const { setPagination, setSearchText, setDebouncedText } = adminSlice.actions;
export default adminSlice.reducer;
