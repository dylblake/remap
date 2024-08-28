import { useState } from 'react';
import { updateService } from '../api/service';  // Import the new updateService function
import { Service } from '../types/Service';

export const useUpdateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateServiceData = async (service: Service) => {
    setLoading(true);
    setError(null);

    try {
      const updatedService = await updateService(service);  // Use the new function
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

  return { updateServiceData, loading, error };
};
