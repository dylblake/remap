import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Adjust path as necessary
import { Service } from '../types/Service'; // Adjust path as necessary

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/services');
        // Adjust based on the actual response structure
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setServices([]);
        }
      } catch (error) {
        setError('Failed to fetch services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const updateServices = async (updatedServices: Service[]) => {
    try {
      await axiosInstance.put('/services', { services: updatedServices });
      setServices(updatedServices);
    } catch (error) {
      console.error('Failed to update services:', error);
    }
  };

  return { services, updateServices, error, isLoading };
};
