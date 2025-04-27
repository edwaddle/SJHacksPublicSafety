/**
 * API utilities for connecting to the backend
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Create fetch options with CORS workarounds
 */
const createFetchOptions = (method = 'GET') => {
  return {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': window.location.origin
    },
    mode: 'cors',
    credentials: 'omit'
  };
};

/**
 * Fetch the API status to check if the backend is running
 */
export const checkApiStatus = async () => {
  try {
    console.log('Checking API status...');
    const response = await fetch(`${API_BASE_URL}/api/status`, createFetchOptions());
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Status:', data);
      return data;
    } else {
      console.error('API Status Error:', response.status, response.statusText);
      throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('API Connection Error:', error.message);
    throw error;
  }
};

/**
 * Fetch weather data from the backend
 * @returns {Promise<Object>} Weather data for San Jose
 */
export const fetchWeather = async () => {
  try {
    console.log('Fetching weather data...');
    const response = await fetch(`${API_BASE_URL}/api/weather`, createFetchOptions());
    
    console.log('Weather API Response:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Weather data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch wildfire data from the backend
 * @returns {Promise<Object>} Wildfire data
 */
export const fetchWildfires = async () => {
  try {
    console.log('Fetching wildfire data...');
    const response = await fetch(`${API_BASE_URL}/api/wildfires`, createFetchOptions());
    
    console.log('Wildfire API Response:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Wildfire API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Wildfire data received:', data);
    
    // Make sure we have a valid data structure even if backend returns unexpected format
    if (!data || typeof data !== 'object') {
      console.warn('Wildfire API returned invalid data format, using empty template');
      return { success: true, count: 0, data: [] };
    }
    
    // Ensure data has the expected structure
    if (!Array.isArray(data.data)) {
      data.data = [];
    }
    
    if (typeof data.count !== 'number') {
      data.count = data.data ? data.data.length : 0;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching wildfire data:', error);
    // Return a valid empty response object instead of throwing
    return { success: false, count: 0, data: [], error: error.message };
  }
};

/**
 * Upload and analyze an image for wildfire detection
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Image analysis failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export default {
  checkApiStatus,
  fetchWeather,
  fetchWildfires,
  analyzeImage
}; 