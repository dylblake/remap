import { useState } from 'react';
import { updateService, updateServiceOrder } from '../api/service';  // Import both functions
import { Service } from '../types/Service';

export const useUpdateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to update a single service
  const updateServiceData = async (service: Service) => {
    setLoading(true);
    setError(null);

    try {
      const updatedService = await updateService(service);
      setLoading(false);
      return updatedService;
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  // Function to update the order of multiple services
  const updateServiceOrderData = async (services: { uuid: string; order: number }[]) => {
    setLoading(true);
    setError(null);

    try {
      await updateServiceOrder(services);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  return { updateServiceData, updateServiceOrderData, loading, error };
};

export default useUpdateService; // Export the hook
