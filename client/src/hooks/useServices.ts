import { useState, useEffect, useCallback } from 'react';
import { fetchServices } from '../api/service';
import { Service } from '../types/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchServicesData = useCallback(() => {
    setIsLoading(true);
    setIsRefetching(false);
    
    fetchServices()
      .then((data) => {
        setServices(data);
      })
      .catch(() => {
        setError('Failed to fetch services');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const refetch = () => {
    setIsRefetching(true);
    
    fetchServices()
      .then((data) => {
        setServices(data);
      })
      .catch(() => {
        setError('Failed to refetch services');
      })
      .finally(() => {
        setIsRefetching(false);
      });
  };

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);

  return { services, error, isLoading, isRefetching, refetch };
};
