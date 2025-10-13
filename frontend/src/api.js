import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000" 
});

//get all designers
export const getDesigners = () => API.get("/designers");
export const getDesignerById = (id) => API.get(`/designers/${id}`);
export const createDesigner = (data) => API.post("/designers", data);
export const updateDesigner = (id, data) => API.put(`/designers/${id}`, data);
export const deleteDesigner = (id) => API.delete(`/designers/${id}`);


export const getComplaints = () => API.get("/complaint");
export const getComplaintById = (id) => API.get(`/complaint/${id}`);
export const createComplaint = (data) => API.post("/complaint", data);
export const updateComplaint = (id, data) => API.put(`/complaint/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/complaint/${id}`);
export const downloadComplaintsPDF = () =>
  API.get("/complaint/download/pdf", { responseType: "blob" });

export const downloadUsersPDF = () =>
  API.get("/bookings/download/pdf", { responseType: "blob" });

