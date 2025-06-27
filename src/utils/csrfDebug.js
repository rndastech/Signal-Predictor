// Debug utility for CSRF issues
export const debugCSRF = () => {
  console.log('=== CSRF Debug Info ===');
  
  // Check for CSRF token in cookies
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (const cookieStr of cookies) {
        const cookie = cookieStr.trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };
  
  const csrfToken = getCookie('csrftoken');
  console.log('CSRF Token from cookie:', csrfToken);
  console.log('All cookies:', document.cookie);
  console.log('Current URL:', window.location.href);
  console.log('Is HTTPS:', window.location.protocol === 'https:');
  console.log('Domain:', window.location.hostname);
  
  // Check environment variables
  console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
  
  return {
    csrfToken,
    cookies: document.cookie,
    isHttps: window.location.protocol === 'https:',
    domain: window.location.hostname,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL
  };
};

// Call this in browser console or add to your component temporarily
window.debugCSRF = debugCSRF;
