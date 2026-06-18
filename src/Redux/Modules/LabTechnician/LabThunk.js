import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPatientProfileByPhone,
  getAllPatientsList,
  LabTechnicianLogin,
  uploadReport,
  downloadReport,
  getFiles,
  getGenericReports,
  addGenericReports,
  getListedReportsList,
  getAppUserId,
  getUserData,
  deleteReport,
} from "../../../Services/LabServices";



export const appUserIdCall = createAsyncThunk(
  'labTechnician/userIdCall',
  async() => await getAppUserId()
)
export const appUserDataCall = createAsyncThunk(
  'labTechnician/userDataCall',
  async(payload) => await getUserData(payload)
)


//Global search api without parameters gets all users data by pagenation
export const fetchPatientList = createAsyncThunk(
  "labTechnician/fetchPatientProfileByPhone",
  async (payload) => {
    return await getAllPatientsList(payload.param);
  }
);

//Global serach api searches for patient with phno/name args'page/size/phno'
export const fetchPatientProfile = createAsyncThunk(
  "labTechnician/fetchPatientProfileByPhone",
  async (payload) => {
    return await fetchPatientProfileByPhone(payload.param);
  }
);

//upload the report for the user
export const uploadReportDoc = createAsyncThunk(
  "labTechnician/uploadReport",
  async (formData) => {
    return await uploadReport(formData);
  }
);

//file list
export const getPatientFiles = createAsyncThunk(
  "labTechnician/uploadReport",
  async (param) => {
    return await getFiles(param);
  }
);

//get Reports list add to patient profile

export const getGenericReportsList = createAsyncThunk(
  "labTechnician/getGenericReportsList",
  async (payload) => {
    return await getGenericReports(payload.param,payload.payload);
  }
);

export const addGenericReportsList = createAsyncThunk(
  "labTechnician/addGenericReportsList",
  async (payload) => { 
    return await addGenericReports(payload.param,payload.payload);
});

export const getListedReports = createAsyncThunk(
  "labTechnician/getListedReports",
  async (param) => {
    return await getListedReportsList(param);
  }
);

export const downloadReportDoc = createAsyncThunk(
  "labTechnician/downloadReport",
  async (param) => {
    return await downloadReport(param);
  }
)

export const deleteReportDoc = createAsyncThunk(
  "labTechnician/deleteReport",
  async (param) => {
    return await deleteReport(param);
  }
);