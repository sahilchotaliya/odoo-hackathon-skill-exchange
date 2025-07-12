import apiClient from './apiService';

export const createSwapRequest = async (requestData) => {
  try {
    // Log the request data and headers for debugging
    console.log('Creating swap request with data:', requestData);
    const response = await apiClient.post('/swaps', requestData);
    return response.data;
  } catch (error) {
    console.error('Swap request error:', error);
    throw error.response?.data || error;
  }
};

export const getUserSwapRequests = async (type) => {
  try {
    const endpoint = type === 'sent' ? '/swaps/sent' : '/swaps/received';
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getPendingSwapRequests = async () => {
  try {
    const response = await apiClient.get('/swaps/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getReceivedRequests = async () => {
  try {
    const response = await apiClient.get('/swaps/received');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSentRequests = async () => {
  try {
    const response = await apiClient.get('/swaps/sent');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const acceptSwapRequest = async (swapId) => {
  try {
    const response = await apiClient.put(`/swaps/${swapId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectSwapRequest = async (swapId) => {
  try {
    const response = await apiClient.put(`/swaps/${swapId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelSwapRequest = async (swapId) => {
  try {
    const response = await apiClient.put(`/swaps/${swapId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitFeedback = async (swapId, feedbackData) => {
  try {
    const response = await apiClient.post(`/swaps/${swapId}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin functions
export const getAllSwaps = async (status = '') => {
  try {
    const url = status ? `/admin/swaps?status=${status}` : '/admin/swaps';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};