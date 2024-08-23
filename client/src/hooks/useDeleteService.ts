import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useDeleteService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteService = async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/services/${uuid}`);
    } catch (err) {
      setError('Failed to delete service');
      console.error('Error deleting service:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteService, isLoading, error };
};
