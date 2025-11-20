const API_BASE_URL = 'http://localhost:8080/api/v1';

export const fetchValueMeasures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/static-data/value-measures`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching value measures:', error);
    throw error;
  }
};
