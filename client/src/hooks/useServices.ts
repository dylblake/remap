import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Service } from '../types/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/services');
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setServices([]); // Handle this case appropriately
        }
      } catch (error) {
        setError('Failed to fetch services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, error, isLoading };
};
