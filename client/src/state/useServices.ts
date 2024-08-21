import { useState, useEffect } from 'react';
import axios from 'axios';

export const useServices = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  const updateServices = async (updatedServices) => {
    try {
      await axios.put('/api/services', { services: updatedServices });
      setServices(updatedServices);
    } catch (error) {
      console.error('Failed to update services:', error);
    }
  };

  return { services, updateServices };
};
