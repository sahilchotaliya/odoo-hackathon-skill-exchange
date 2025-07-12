import apiClient from './apiService';

// Login function
export const login = async (email, password) => {
  try {
    console.log('Attempting login with email:', email);
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('Login response:', response);
    const { token, user } = response.data;
    console.log('Token received:', token ? 'Token received successfully' : 'No token received');
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id); // Add this line to store userId
      return user;
    } else {
      throw new Error('No authentication token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      throw error.response.data || { message: 'Login failed. Please try again.' };
    }
    throw { message: 'Network error. Please check your connection.' };
  }
};

// Register function
export const register = async (userData) => {
  try {
    console.log('Sending registration data:', userData);
    const response = await apiClient.post('/auth/register', userData);
    console.log('Registration response:', response);

    const { token, user } = response.data;
    console.log('Token received from registration:', token ? 'Token received successfully' : 'No token received');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id); // Add this line to store userId
      return user;
    } else {
      console.error('No token received from registration');
      throw new Error('No authentication token received');
    }
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    if (error.response && error.response.data) {
      if (typeof error.response.data === 'object' && error.response.data.message) {
        throw { message: error.response.data.message };
      } else if (typeof error.response.data === 'string') {
        throw { message: error.response.data };
      }
    }
    throw { message: 'Registration failed. Please try again.' };
  }
};

// Logout function
export const logout = async () => {
  try {
    console.log('Removing token and user from localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); // Add this line to remove userId
    console.log('Token after removal:', localStorage.getItem('token'));
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); // Add this line to remove userId
  }
};

// Get current user function
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Optional: small delay to ensure token is set
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};
