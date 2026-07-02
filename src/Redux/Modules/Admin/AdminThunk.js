import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminListUsers } from '../../../Services/adminService';

export const listUsersThunk = createAsyncThunk(
  'admin/listUsers',
  async ({ page, size, searchQuery }) => {
    const data = await adminListUsers({ page, size, searchQuery });
    return data;
  }
);
