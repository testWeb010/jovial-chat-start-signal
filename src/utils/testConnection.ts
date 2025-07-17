
export const testConnection = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('Connection successful:', data);
      return true;
    } else {
      console.error('Connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Connection error:', error);
    return false;
  }
};
