const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://memory-nest-backend.onrender.com/api';

export default API_URL;