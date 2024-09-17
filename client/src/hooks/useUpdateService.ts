import { useState } from 'react';
import { updateServices, updateServiceOrder } from '../api/service';  // Import both functions
import { Service } from '../types/Service';

export const useUpdateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to update multiple services
  const updateServiceData = (services: Service[]) => {
    setLoading(true);
    setError(null);

    return updateServices(services)
      .then((updatedServices) => {
        console.log("Services updated successfully:", updatedServices); // Add log to confirm success
        return updatedServices;
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        console.error("Error updating services:", err); // Add log to check error
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to update the order of multiple services
  const updateServiceOrderData = (services: { uuid: string; order: number }[]) => {
    setLoading(true);
    setError(null);

    return updateServiceOrder(services)
      .then(() => {
        console.log("Service order updated successfully.");
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        console.error("Error updating service order:", err);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { updateServiceData, updateServiceOrderData, loading, error };
};

export default useUpdateService;
