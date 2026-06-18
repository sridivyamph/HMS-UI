import { configureStore } from '@reduxjs/toolkit';
import homeSlice from './Modules/Patient/HomeSlice';
import receptionSlice from './Modules/Reception/ReceptionSlice';
import AuthSlice from './Modules/Slice/authSlice';
import doctorSlice from './Modules/Doctor/DoctorSlice';
import LabTechnicianSlice from './Modules/LabTechnician/LabSlice';
// Configure store
const store = configureStore({
  reducer: {
    auth: AuthSlice,
    home: homeSlice,
    reception: receptionSlice,
    doctor: doctorSlice,
    LabTechnician: LabTechnicianSlice,
  },
});

// Export the store
export default store;
