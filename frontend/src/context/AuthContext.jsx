import api from '../api/axios' // Import kar

const login = async (email, password) => {
  try {
    const { data } = await api.post('/users/login', { email, password });

    // Backend se token milega
    localStorage.setItem('mn_token', data.token);
    localStorage.setItem('memoryNestUser', JSON.stringify(data));

    setUser(data);
    toast.success('Welcome back!');
    navigate('/home');
    return true;
  } catch (error) {
    toast.error('Invalid email or password');
    throw new Error('Invalid credentials');
  }
}

const register = async (name, email, password, phone) => {
  try {
    const { data } = await api.post('/users/register', { name, email, password, phone });

    localStorage.setItem('mn_token', data.token);
    localStorage.setItem('memoryNestUser', JSON.stringify(data));

    setUser(data);
    toast.success('Account created successfully!');
    navigate('/home');
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed');
    throw error;
  }
}