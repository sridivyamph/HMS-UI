import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';
import Spinner from './Components/Backdrop/Backdrop';
import BackToTop from './Components/BackToTop/BackToTop';
import { useDispatch, useSelector } from 'react-redux';
import ReceptionLanding from './Pages/Reception/Home/ReceptionLanding';
import ViewPatientProfile from './Pages/Reception/Profiles/ViewPatientProfile';
import LabReports from './Pages/Reception/LabReports/LabReports';
import ReceptionLogin from './Pages/Reception/Home/ReceptionLogin';
import ProtectedRoute from './utils/ProtectedRoute';
import ReceptionProfile from './Pages/Reception/Profiles/ReceptionProfile';

import LabDashboard from './Pages/LabTechnician/Home/LabDashboard';
import LabPatientProfile from './Pages/LabTechnician/Profile/ViewPatientProfile';
import DoctorViewPatientProfile from './Pages/Doctor/ViewPatientProfile/ViewPatientProfile';

// APP CONFIG

import { fetchConfigThunk } from './Redux/Modules/Slice/authSlice';
import CommonLogin from './Components/Login/login';

// import ViewPatientProfile from './Components/PatientProfile/ViewPatientProfile';

const DocDashboard = lazy(() => import('./Pages/Doctor/Dashboard/DoctorDashboard'));
const DoctorLogin = lazy(() => import('./Pages/Doctor/DoctorLogin/DoctorLogin'));
const DoctorViewPatientProfileLabReports = lazy(() =>
  import('./Pages/Doctor/DoctorViewPatientLabReport/DoctorViewPatientLabReport')
);

const BookAppointment = lazy(() => import('./Pages/Patient/BookAppointment/BookAppointment'));
const Profile = lazy(() => import('./Pages/Patient/Profile/Profile'));
const LabReport = lazy(() => import('./Pages/Patient/LabReport/LabReport'));

// PATIENT ROUTES
const PatientHome = lazy(() => import('./Pages/Patient/Home/PatientGuestVersion'));
const PatientDashboard = lazy(() => import('./Pages/Patient/Home/PatientDashboard'));

// ADMIN ROUTES
const AddUser = lazy(() => import('./Pages/Admin/Adduser/Adduser'));
const AdminDashboard = lazy(() => import('./Pages/Admin/Dashboard/AdminDashboard'));

// PUBLIC PAGES
const AboutUs = lazy(() => import('./Pages/Public/AboutUs'));
const Service = lazy(() => import('./Pages/Public/Service'));
const Gallery = lazy(() => import('./Pages/Public/Gallery'));
const Blog = lazy(() => import('./Pages/Public/Blog'));
const Careers = lazy(() => import('./Pages/Public/Careers'));
const ContactUs = lazy(() => import('./Pages/Public/ContactUs'));

// NO ROUTES FOUND
const NotFound = lazy(() => import('./Components/NotFound/NotFound'));
const Main = () => {
  const { showBackdrop } = useSelector((state) => state.home);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConfigThunk());
  }, []);
  return (
    <Suspense fallback={null}>
      <Spinner open={showBackdrop} />
      <BackToTop />
      <Routes>
        <Route path='/patient/login' element={<PatientHome />} />
        <Route
          path='/patient/dashboard'
          element={
            <ProtectedRoute accessRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/patient/bookappointment'
          element={
            <ProtectedRoute accessRoles={['PATIENT']}>
              <BookAppointment /> {/*showing page for appointment booking */}
            </ProtectedRoute>
          }
        />
        <Route
          path='/patient/profile'
          element={
            <ProtectedRoute accessRoles={['PATIENT']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/patient/profile/labreport'
          element={
            <ProtectedRoute accessRoles={['PATIENT']}>
              <LabReport />
            </ProtectedRoute>
          }
        />

        {/* DOCTOR ROUTES */}
        <Route path='/doctor/login' element={<CommonLogin />} />
        <Route
          path='/doctor/dashboard'
          element={
            <ProtectedRoute accessRoles={['DOCTOR']}>
              <DocDashboard /> {/* it is related  to doctor showing the appointment details */}
            </ProtectedRoute>
          }
        />

        <Route
          path='/doctor/patientProfile/:userId'
          element={
            <ProtectedRoute accessRoles={['DOCTOR']}>
              <DoctorViewPatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/doctor/patientProfile/lab/reports/:userId'
          element={
            <ProtectedRoute accessRoles={['DOCTOR']}>
              <DoctorViewPatientProfileLabReports />
            </ProtectedRoute>
          }
        />

        {/* RECEPTIONIST ROUTES */}
        <Route
          path='/reception/dashboard'
          element={
            <ProtectedRoute accessRoles={['RECEPTIONIST']}>
              <ReceptionLanding />
            </ProtectedRoute>
          }
        />
        <Route path='/reception/login' element={<CommonLogin />} />
        <Route
          path='/reception/profile'
          element={
            <ProtectedRoute accessRoles={['RECEPTIONIST']}>
              <ReceptionProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/receptionist/patientProfile/:id'
          element={
            <ProtectedRoute accessRoles={['RECEPTIONIST', 'DOCTOR']}>
              <ViewPatientProfile />
              {/*showing patients profile to receptionist or to doctor */}
            </ProtectedRoute>
          }
        />
        {/*  LAB ROUTES */}
        <Route
          path='/recepetion/lab/reports/:id'
          element={
            <ProtectedRoute accessRoles={['RECEPTIONIST']}>
              <LabReports /> {/*recepetionist can see the lab reports of the patient */}
            </ProtectedRoute>
          }
        />
        <Route path='/lab/login' element={<CommonLogin />}></Route>

        <Route
          path='/lab/dashboard'
          element={
            <ProtectedRoute accessRoles={['LAB-TECHNICIAN']}>
              <LabDashboard />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/lab/patientProfile/:id'
          element={
            <ProtectedRoute accessRoles={['LAB-TECHNICIAN']}>
              <LabPatientProfile />
            </ProtectedRoute>
          }
        ></Route>
        {/*  ADMIN ROUTES */}
        <Route path='/admin/login' element={<CommonLogin />}></Route>
        <Route
          path='/admin/adduser'
          element={
            <ProtectedRoute accessRoles={['ADMIN']}>
              <AddUser />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute accessRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        ></Route>
        {/* PUBLIC PAGES */}
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/service' element={<Service />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/careers' element={<Careers />} />
        <Route path='/contact-us' element={<ContactUs />} />
        {/* NO ROUTES FOUND */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
