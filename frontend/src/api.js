import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Function to set the token on Axios headers
export const setToken = (token) => {
  api.defaults.headers.common['x-auth-token'] = token;
};

export const login = (data) => api.post('/login', data);
export const createUser = (data) => api.post('/users', data);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const enrollInCourse = (data) => api.post('/courses/enroll', data);
export const createSession = (data) => api.post('/sessions', data);
export const updateSession = (id, data) => api.put(`/sessions/${id}`, data);
export const broadcastLocation = (id, data) => api.post(`/sessions/${id}/broadcast`, data);
export const markAttendance = (id, data) => api.post(`/sessions/${id}/attendance`, data);

export default api;
