const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  
  console.log('1. Login button clicked');
  console.log('2. Form data:', form);
  
  try {
    console.log('3. Calling login function...');
    const userData = await login(form.email, form.password);
    
    console.log('4. Login Success! UserData:', userData);
    
    // FIX: 300ms delay + replace use kar
    setTimeout(() => {
      window.location.replace('/')
    }, 300);
    
  } catch (err) {
    console.log('5. LOGIN ERROR CAUGHT:', err);
    console.log('6. Error message:', err.message);
    console.log('7. Error response:', err.response?.data);
    setError(err.message || 'Login failed. Please try again.')
    setLoading(false)
  } 
}