import { useState } from 'react';
import { updateServices, updateServiceOrder } from '../api/service';  // Import both functions
import { Service } from '../types/Service';

export const useUpdateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

// Hook to handle updating multiple services
const updateServiceData = (services: Service[]) => {
  setLoading(true); // Set loading to true to indicate the update is in progress
  setError(null);   // Clear any previous errors

  // Call the function to update services and handle the promises
  return updateServices(services)
    .then((updatedServices) => {
      // Successfully updated services, log for debugging
      console.log("Services updated successfully:", updatedServices);
      return updatedServices; // Return the updated services
    })
    .catch((err) => {
      // If an error occurs, handle it and set the error message
      if (err instanceof Error) {
        setError(err.message); // Set specific error message if available
      } else {
        setError("An unexpected error occurred"); // Default error message
      }
      console.error("Error updating services:", err); // Log the error for debugging
      throw err; // Rethrow the error to handle it in the calling component if necessary
    })
    .finally(() => {
      setLoading(false); // Set loading to false regardless of success or failure
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
