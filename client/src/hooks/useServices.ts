import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Service } from '../types/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(false);
    try {
      const response = await axiosInstance.get('/services');
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
  }, []);

  const refetch = async () => {
    setIsRefetching(true);
    try {
      await fetchServices();
    } finally {
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, error, isLoading, isRefetching, refetch };
};
