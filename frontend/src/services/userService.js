import apiClient from './apiService';

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserSkills = async () => {
  try {
    const response = await apiClient.get('/users/skills');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserSkills = async (skills) => {
  try {
    const response = await apiClient.put('/users/skills', skills);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



// Add the missing getAllUsers function
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserAvailability = async (availability) => {
  try {
    const response = await apiClient.put('/users/availability', { availability });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const toggleProfileVisibility = async (isPublic) => {
  try {
    const response = await apiClient.put('/users/visibility', { isPublic });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add this function to userService.js
// Change from const to export const
export const uploadProfileImage = async (formData) => {
  try {
    const response = await apiClient.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};