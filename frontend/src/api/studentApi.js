import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Student CRUD
export const fetchStudents = () => API.get("/students");
export const addStudent = (data) => API.post("/students", data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Authentication
export const loginAdmin = (data) => API.post("/admin/login", data);
export const loginStudent = (data) => API.post("/students/login", data);

// Course Application Admin Actions
export const fetchApplications = () => API.get("/applications");
export const approveApplication = (courseId, applicationId) =>
  API.put(`/applications/${courseId}/${applicationId}/approve`);
export const rejectApplication = (courseId, applicationId) =>
  API.put(`/applications/${courseId}/${applicationId}/reject`);

// Results
export const fetchResults = () => API.get("/results");
export const addResult = (data) => API.post("/results", data);

