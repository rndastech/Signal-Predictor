import axios from 'axios';

// Helper to read CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Create a separate axios instance for fetching CSRF token to avoid circular dependencies
const csrfApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// Main API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Function to ensure we have a CSRF token
async function ensureCSRFToken() {
  let csrfToken = getCookie('csrftoken');
  
  if (!csrfToken) {
    try {
      const response = await csrfApi.get('/csrf/');
      csrfToken = getCookie('csrftoken');
      
      // If still no token from cookie, try to get it from response
      if (!csrfToken && response.data && response.data.csrfToken) {
        csrfToken = response.data.csrfToken;
      }
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
    }
  }
  
  return csrfToken;
}

// Request interceptor: ensure CSRF token for mutating requests
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      // Ensure we have a CSRF token
      const csrfToken = await ensureCSRFToken();
      
      if (csrfToken) {
        // Set the token in headers
        if (!config.headers) {
          config.headers = {};
        }
        config.headers['X-CSRFToken'] = csrfToken;
        
        // For multipart/form-data, we need to be careful not to override Content-Type
        if (config.headers['Content-Type'] !== 'multipart/form-data') {
          config.headers['Content-Type'] = 'application/json';
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    // Preserve original error with response for downstream handlers
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),
  verifyEmail: (uid, token) => api.get(`/auth/verify-email/${uid}/${token}/`),
  changePassword: (passwordData) => api.post('/auth/change-password/', passwordData),
  requestPasswordReset: (data) => api.post('/auth/password-reset/', data),
  confirmPasswordReset: (data) => api.post('/auth/password-reset-confirm/', data),
};

// Helper to read CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Signal Analysis API calls
export const signalAPI = {
  getHome: () => api.get('/home/'),
  uploadCSV: (formData) => {
    return api.post('/upload/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  evaluateFunction: (xValue, analysisId = null) => {
    const data = { x_values: Array.isArray(xValue) ? xValue : [xValue] };
    if (analysisId) data.analysis_id = analysisId;
    return api.post('/evaluate/', data);
  },
  getAnalyses: () => api.get('/analyses/'),
  getAnalysis: (id) => api.get(`/analyses/${id}/`),
  updateAnalysis: (id, data) => api.patch(`/analyses/${id}/`, data),
  deleteAnalysis: (id) => api.delete(`/analyses/${id}/`),
  bulkDeleteAnalyses: (analysisIds) => {
    return api.post('/analyses/bulk-delete/', { analysis_ids: analysisIds });
  },
  saveSessionAnalysis: () => api.post('/save-analysis/'),
  clearSession: () => api.post('/clear-session/'),
  
  // Share functionality
  getShareOptions: (analysisId) => api.get(`/analyses/${analysisId}/share-options/`),
  updateShareOptions: (analysisId, shareData) => {
    return api.post(`/analyses/${analysisId}/share-options/`, shareData);
  },
  getSharedAnalysis: (analysisId) => api.get(`/share/${analysisId}/`),
  accessPasswordProtectedAnalysis: (analysisId, password) => {
    return api.post(`/share/${analysisId}/`, { password });
  },
};

// Signal Generator API calls
export const generatorAPI = {
  generateSignal: (params) => api.post('/generator/', params),
};

// User Profile API calls
export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (profileData) => {
    return api.patch('/profile/', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
};

// Utility function to manually refresh CSRF token
export const refreshCSRFToken = async () => {
  try {
    const response = await csrfApi.get('/csrf/');
    const tokenFromCookie = getCookie('csrftoken');
    const tokenFromResponse = response.data?.csrfToken;
    
    console.log('CSRF Token refreshed:', {
      fromCookie: tokenFromCookie,
      fromResponse: tokenFromResponse
    });
    
    return tokenFromCookie || tokenFromResponse;
  } catch (error) {
    console.error('Failed to refresh CSRF token:', error);
    throw error;
  }
};

export default api;
