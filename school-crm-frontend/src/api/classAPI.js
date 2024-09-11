import apiClient from './apiClient';

export const fetchClasses = async () => {
  try {
    const response = await apiClient.get('/classes/getall');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
};

export const fetchClassById = async (id) => {
  try {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class:', error);
    return null;
  }
};
