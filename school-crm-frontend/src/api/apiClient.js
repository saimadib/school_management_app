import axios from 'axios';

// Create Axios instance
const apiClient = axios.create({
  baseURL: 'https://schoolcrm.online/api', // Adjust according to your backend URL
});
//http://ec2-13-60-18-101.eu-north-1.compute.amazonaws.com:3000/api
// Interceptor to add token to request headers
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API to get teachers for a student
export const getStudentTeachers = () => apiClient.get(`/students/teachers`);

// API to get classes for a student
export const getStudentClasses = () => apiClient.get(`/students/classes`);

export const getTeachersClasses = () => apiClient.get(`/teachers/classes/detail`);
// API to get students for a teacher
export const getTeacherStudents = () => apiClient.get(`/teachers/students/detail`);

// API to get all students for admin
export const getAllStudents = () => apiClient.get('/students');

// API to get all teachers for admin
export const getAllTeachers = () => apiClient.get('/teachers');

// API to get all classes for admin
export const getAllClasses = () => apiClient.get('/classes');

export default apiClient;
