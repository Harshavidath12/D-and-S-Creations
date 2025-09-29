import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api" 
});

//get all designers
export const getDesigners = () => API.get("/designers");
export const getDesignerById = (id) => API.get(`/designers/${id}`);
export const createDesigner = (data) => API.post("/designers", data);
export const updateDesigner = (id, data) => API.put(`/designers/${id}`, data);
export const deleteDesigner = (id) => API.delete(`/designers/${id}`);


export const getComplaints = () => API.get("/complaints");
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const createComplaint = (data) => API.post("/complaints", data);
export const updateComplaint = (id, data) => API.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);
export const downloadComplaintsPDF = () =>
  API.get("/complaints/download/pdf", { responseType: "blob" });
