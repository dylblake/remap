import { useState, useEffect, useCallback } from 'react';
import { fetchServices } from '../api/service';
import { Service } from '../types/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchServicesData = useCallback(async () => {
    setIsLoading(true);
    setIsRefetching(false);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      setError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = async () => {
    setIsRefetching(true);
    try {
      await fetchServicesData();
    } finally {
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);

  return { services, error, isLoading, isRefetching, refetch };
};