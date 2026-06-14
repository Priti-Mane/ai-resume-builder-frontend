import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);
export const changePassword = (data) => api.put("/auth/change-password", data);
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`);
export const resendVerification = () => api.post("/auth/resend-verification");
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// ---------- RESUME ----------
export const getResume = () => api.get("/resume");
export const saveResume = (data) => api.post("/resume", data);

// ---------- AI ----------
export const generateAISummary = (data) => api.post("/ai/summary", data);
export const generateAISkills = (data) => api.post("/ai/skills", data);
export const generateAIProjectDesc = (data) => api.post("/ai/project", data);

// ---------- JOBS ----------
export const getJobs = () => api.get("/jobs");
export const addJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

export default api;
