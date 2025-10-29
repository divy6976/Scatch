import axios from 'axios';

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;

// Optionally set a base URL for your backend
// axios.defaults.baseURL = 'http://localhost:6969';

export default axios;

